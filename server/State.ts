import { Room } from 'Room';
import { Session } from 'Session';
import { ServerEvents } from 'shared/types/ServerEvents';
import { ServerSocket } from 'shared/types/Socket';

export class State {
  // Should probably be a map of rooms
  private rooms: Room[] = [new Room()];
  private sessions = new Map<string, Session>();

  async addSocket(socket: ServerSocket<ServerEvents>) {
    const session = this.ensureSession(socket);
    if (!session) {
      return;
    }

    session.log(`Joined (${this.getActiveUserCount()} total)`);

    socket.on('disconnect', () => {
      session.disconnectSocket();
      session.log(`Left (${this.getActiveUserCount()} total)`);
    });

    const confirmed = await this.confirmSession(session);
    if (!confirmed) {
      return;
    }

    session.log('Confirmed');
    this.setUpEvents(session);

    // Temporarily join the only existing room
    this.joinRoom(session, this.rooms[0]);
  }

  private confirmSession(session: Session): Promise<boolean> {
    return new Promise((resolve) => {
      const { socket } = session;
      socket?.emit('session estabilished', session.getState());
      socket?.on('session id received', async (clientSessionId) => {
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

    socket?.on('name set', (name) => {
      session.setName(name);
      this.emitRoomStateChanged(session, true);
    });
  }

  private joinRoom(session: Session, room: Room) {
    const { socket } = session;

    session.joinRoom(room);
    this.emitRoomStateChanged(session, true);

    socket?.on('add next card', () => {
      const { room } = session;
      if (!room) {
        return;
      }

      room.requestNextCard(session);
      this.emitRoomStateChanged(session, true);
    });

    socket?.on('room joined', () => {
      this.emitRoomStateChanged(session);
    });

    socket?.on('set selected', (cards) => {
      const { room } = session;
      if (!room) {
        return;
      }

      if (room.trySelectSet(session, cards)) {
        this.emitRoomStateChanged(session, true);
      }
    });

    socket?.on('disconnect', () => {
      const { room } = session;
      session.leaveRoom();
      this.emitRoomStateChanged(session, true, room);
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
      const session = new Session(socket);
      this.sessions.set(session.id, session);
      return session;
    }
  }

  private getActiveUserCount() {
    return this.sessions.size;
  }
}
