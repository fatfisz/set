import { getPseudoUniqueId } from 'getPseudoUniqueId';
import { getRandomName } from 'getRandomName';
import { Room } from 'Room';
import { Session } from 'Session';
import { ServerEvents } from 'shared/types/ServerEvents';
import { ServerSocket } from 'shared/types/Socket';

export class State {
  private names = new Map<string, string>();
  // Should probably be a map of rooms
  private rooms: Room[] = [new Room()];
  private sessions = new Map<string, Session>();

  getActiveUserCount() {
    return this.sessions.size;
  }

  async addSocket(socket: ServerSocket<ServerEvents>) {
    const sessionId = this.ensureSession(socket);
    console.log(`[${sessionId}] Joined (${this.getActiveUserCount()} total)`);

    socket.on('disconnect', () => {
      this.getSession(sessionId)?.disconnectSocket();
      console.log(`[${sessionId}] Left (${this.getActiveUserCount()} total)`);
    });

    this.ensureName(sessionId);

    const confirmed = await this.confirmSession(sessionId);
    if (!confirmed) {
      return;
    }

    console.log(`[${sessionId}] Confirmed`);
    this.setUpEvents(sessionId);

    // Temporarily join the only existing room
    this.joinRoom(sessionId, this.rooms[0]);
  }

  private confirmSession(sessionId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = this.getSocket(sessionId);
      socket?.emit('session id granted', sessionId);
      socket?.on('session id received', async (clientSessionId) => {
        if (clientSessionId === sessionId) {
          resolve(true);
        } else {
          console.error(
            `[${sessionId}] Confirmation failure: received ${clientSessionId}`
          );
          socket?.disconnect();
          resolve(false);
        }
      });
    });
  }

  private setUpEvents(sessionId: string) {
    const socket = this.getSocket(sessionId);

    socket?.on('name set', (name) => {
      this.names.set(sessionId, name);
      this.emitRoomStateChanged(sessionId, true);
    });
  }

  private joinRoom(sessionId: string, room: Room) {
    const socket = this.getSocket(sessionId);

    this.getSession(sessionId)?.joinRoom(room);
    this.emitRoomStateChanged(sessionId, true);

    socket?.on('add next card', () => {
      const room = this.getRoom(sessionId);
      if (!room) {
        return;
      }

      room.requestNextCard(sessionId);
      this.emitRoomStateChanged(sessionId, true);
    });

    socket?.on('room joined', () => {
      this.emitRoomStateChanged(sessionId);
    });

    socket?.on('set selected', (cards) => {
      const room = this.getRoom(sessionId);
      if (!room) {
        return;
      }

      if (room.trySelectSet(sessionId, cards)) {
        this.emitRoomStateChanged(sessionId, true);
      }
    });

    socket?.on('disconnect', () => {
      this.getSession(sessionId)?.leaveRoom();
    });
  }

  private emitRoomStateChanged(sessionId: string, everyone = false) {
    const room = this.getRoom(sessionId);
    if (!room) {
      return;
    }

    const socket = this.getSocket(sessionId);
    const roomState = room.getState(this.names);

    socket?.emit('room state changed', roomState);

    if (everyone) {
      room?.forEachParticipant((participantSessionId) => {
        if (participantSessionId !== sessionId) {
          this.getSession(participantSessionId)?.socket?.emit(
            'room state changed',
            roomState
          );
        }
      });
    }
  }

  private ensureSession(socket: ServerSocket<ServerEvents>) {
    const { sessionId } = socket.handshake.query;
    if (this.sessions.has(sessionId)) {
      this.getSession(sessionId)?.setSocket(socket);
      return sessionId as string;
    } else {
      const sessionId = getPseudoUniqueId();
      this.sessions.set(sessionId, new Session(sessionId, socket));
      return sessionId;
    }
  }

  private ensureName(sessionId: string) {
    if (!this.names.has(sessionId)) {
      this.names.set(sessionId, getRandomName());
    }
  }

  private getRoom(sessionId: string) {
    return this.getSession(sessionId)?.room;
  }

  private getSocket(sessionId: string) {
    return this.getSession(sessionId)?.socket;
  }

  private getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }
}
