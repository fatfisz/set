import { db } from 'Database';
import { Room } from 'Room';
import { Session } from 'Session';
import { RoomOptions } from 'shared/types/RoomOptions';
import { ServerEvents } from 'shared/types/ServerEvents';
import { ServerSocket } from 'shared/types/Socket';

export class State {
  private rooms = new Map<string, Room>();
  private sessions = new Map<string, Session>();

  constructor() {
    this.createRoom({ autoAddCard: true, name: 'Test room' });
  }

  async initFromDb() {
    const rooms = await db.collection('room');
    rooms.find().forEach((room) => {
      this.rooms.set(room.id, Room.deserialize(room, this.sessions));
    });

    const sessions = await db.collection('session');
    sessions.find().forEach((session) => {
      this.sessions.set(session.id, Session.deserialize(session));
    });
  }

  async addSocket(socket: ServerSocket<ServerEvents>) {
    const session = this.ensureSession(socket);
    if (!session) {
      return;
    }

    session.log(`Joined (${this.getActiveUserCount()} total)`);

    const confirmed = await this.confirmSession(session);
    if (!confirmed) {
      return;
    }

    session.log('Confirmed');
    this.setUpEvents(session);
  }

  private confirmSession(session: Session): Promise<boolean> {
    return new Promise((resolve) => {
      const { socket } = session;
      socket?.emit('session estabilished', session.getState());
      socket?.on('confirm session', async (clientSessionId) => {
        if (clientSessionId === session.id) {
          resolve(true);
        } else {
          session.log(`Confirmation failure: received ${clientSessionId}`);
          socket?.disconnect();
          resolve(false);
        }
      });
    });
  }

  private setUpEvents(session: Session) {
    const { socket } = session;

    socket?.on('set name', (name) => {
      session.setName(name);
      this.emitRoomStateChanged(session, true);
    });

    this.emitLobbyStateChanged();

    socket?.on('join room', (roomId) => {
      const room = this.rooms.get(roomId);
      if (room) {
        this.joinRoom(session, room);
      }
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
      session.log(`Left (${this.getActiveUserCount()} total)`);
    });
  }

  private emitLobbyStateChanged() {
    const lobbyState = this.getLobbyState();
    this.sessions.forEach((session) => {
      session.socket?.emit('lobby state changed', lobbyState);
    });
  }

  private joinRoom(session: Session, room: Room) {
    if (session.room) {
      return;
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
        session.log('Tried to open another window');
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
  const registeredListeners: [any, (...args: any[]) => void][] = [];
  try {
    socket.on = (name: any, listener: (...args: any[]) => void) => {
      registeredListeners.push([name, listener]);
      originalOn.call(socket, name, listener);
    };
    callback(socket);
  } finally {
    socket.on = originalOn;
  }

  return () => {
    registeredListeners.forEach(([name, listener]) => {
      socket.off(name, listener);
    });
  };
}
