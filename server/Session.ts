import { Room } from 'Room';
import { ServerEvents } from 'shared/types/ServerEvents';
import { ServerSocket } from 'shared/types/Socket';

export class Session {
  private id: string;
  room: Room | undefined = undefined;
  socket: ServerSocket<ServerEvents> | undefined;

  constructor(id: string, socket: ServerSocket<ServerEvents>) {
    this.id = id;
    this.setSocket(socket);
  }

  setSocket(socket: ServerSocket<ServerEvents>) {
    this.socket = socket;
  }

  disconnectSocket() {
    this.socket = undefined;
  }

  joinRoom(room: Room) {
    this.room = room;
    this.room.addPlayer(this.id);
  }

  leaveRoom() {
    this.room?.removePlayer(this.id);
    this.room = undefined;
  }
}
