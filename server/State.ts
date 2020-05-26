import * as roomCollection from 'collections/roomCollection';
import * as sessionCollection from 'collections/sessionCollection';
import { Room } from 'Room';
import { Session } from 'Session';
import { RoomOptions } from 'shared/types/RoomOptions';
import { ServerEvents } from 'shared/types/ServerEvents';
import { ServerSocket } from 'shared/types/Socket';

export class State {
  private rooms = new Map<string, Room>();
  private sessions = new Map<string, Session>();

  async initFromDb() {
    await sessionCollection.forEach((session) => {
      this.sessions.set(session.id, Session.deserialize(session));
    });

    await roomCollection.forEach((room) => {
      this.rooms.set(room.id, Room.deserialize(room, this.sessions));
    });
  }

  async addSocket(socket: ServerSocket<ServerEvents>) {
    const session = this.ensureSession(socket);
    if (!session) {
      return;
    }

    session.socket?.log(`Joined (${this.getActiveUserCount()} total)`);

    const confirmed = await this.confirmSession(session);
    if (!confirmed) {
      return;
    }

    session.socket?.log('Confirmed');
    this.setUpEvents(session);
  }

  private async confirmSession(session: Session): Promise<boolean> {
    const { socket } = session;
    const clientSessionId = await socket?.emit(
      'session estabilished',
      session.getState()
    );
    if (clientSessionId === session.id) {
      return true;
    } else {
      socket?.log(`Confirmation failure: received ${clientSessionId}`);
      socket?.disconnect();
      return false;
    }
  }

  private setUpEvents(session: Session) {
    const { socket } = session;

    this.emitLobbyStateChanged();

    socket?.on('set name', (name) => {
      session.setName(name);
      this.emitRoomStateChanged(session, true);
    });

    socket?.on('join room', (roomId) => {
      const room = this.rooms.get(roomId);
      if (!room) {
        return false;
      }
      return this.joinRoom(session, room);
    });

    socket?.on('create room', (options) => {
      if (session.room) {
        return;
      }
      this.createRoom(options);
      this.emitLobbyStateChanged();
    });

    socket?.on('disconnect', () => {
      session.disconnectSocket();
      this.emitLobbyStateChanged();
      socket.log(`Left (${this.getActiveUserCount()} total)`);
    });

    socket?.emit('server ready');
  }

  private emitLobbyStateChanged() {
    const lobbyState = this.getLobbyState();
    this.sessions.forEach((session) => {
      session.socket?.emit('lobby state changed', lobbyState);
    });
  }

  private joinRoom(session: Session, room: Room): boolean {
    if (session.room) {
      return false;
    }

    const removeListeners = withSocketListenerRemoval(session, (socket) => {
      session.joinRoom(room);
      this.emitRoomStateChanged(session, true);

      socket.on('add next card', () => {
        withRoom(session, (room) => {
          room.requestNextCard(session);
          this.emitRoomStateChanged(session, true);
        });
      });

      socket.on('select set', (cards) => {
        withRoom(session, (room) => {
          if (room.trySelectSet(session, cards)) {
            this.emitRoomStateChanged(session, true);
          }
        });
      });

      const leaveRoom = () => {
        const { room } = session;
        session.leaveRoom();
        this.emitRoomStateChanged(session, true, room);
      };

      socket.on('leave room', () => {
        leaveRoom();
        removeListeners?.();
      });

      socket.on('disconnect', leaveRoom);
    });

    return true;
  }

  private emitRoomStateChanged(
    session: Session,
    everyone = false,
    room = session.room
  ) {
    if (!room) {
      return;
    }

    const { socket } = session;
    const roomState = room.getState();

    socket?.emit('room state changed', roomState);

    if (everyone) {
      room?.forEachParticipant((participantSession) => {
        if (participantSession !== session) {
          participantSession.socket?.emit('room state changed', roomState);
        }
      });
    }
  }

  private ensureSession(socket: ServerSocket<ServerEvents>) {
    const { sessionId } = socket.handshake.query;
    const session = this.sessions.get(sessionId);

    if (session) {
      if (session.socket) {
        session.socket.log(`Tried to open another window (${socket.id})`);
        session.socket.disconnect(true);
        return;
      }
      session.setSocket(socket);
      return session;
    } else {
      const session = new Session({ socket });
      this.sessions.set(session.id, session);
      return session;
    }
  }

  private createRoom(options: RoomOptions) {
    const room = new Room({ options });
    this.rooms.set(room.id, room);
  }

  private getLobbyState() {
    return {
      rooms: [...this.rooms.values()].map((room) => room.getLobbyState()),
    };
  }

  private getActiveUserCount() {
    return this.sessions.size;
  }
}

function withRoom(session: Session, callback: (room: Room) => void) {
  const { room } = session;
  if (room) {
    callback(room);
  }
}

function withSocketListenerRemoval(
  session: Session,
  callback: (socket: ServerSocket<ServerEvents>) => void
) {
  const { socket } = session;
  if (!socket) {
    return;
  }

  const originalOn = socket.on;
  const cleanupFunctions: ((...args: any[]) => void)[] = [];
  try {
    socket.on = (name: any, listener: (...args: any) => void) => {
      const cleanup = originalOn.call(socket, name, listener);
      cleanupFunctions.push(cleanup);
      return cleanup;
    };
    callback(socket);
  } finally {
    socket.on = originalOn;
  }

  return () => {
    cleanupFunctions.forEach((cleanup) => {
      cleanup();
    });
  };
}
