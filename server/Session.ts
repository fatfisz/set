import { getPseudoUniqueId } from 'getPseudoUniqueId';
import { getRandomName } from 'getRandomName';
import { Room } from 'Room';
import { ServerEvents } from 'shared/types/ServerEvents';
import { ServerSocket } from 'shared/types/Socket';

export class Session {
  readonly id: string;
  name: string;
  room: Room | undefined = undefined;
  socket: ServerSocket<ServerEvents> | undefined;

  constructor(socket?: ServerSocket<ServerEvents>) {
    this.id = getPseudoUniqueId();
    this.name = getRandomName();
    if (socket) {
      this.setSocket(socket);
    }
  }

  getState() {
    return {
      id: this.id,
      name: this.name,
    };
  }

  setSocket(socket: ServerSocket<ServerEvents>) {
    this.socket = socket;
  }

  disconnectSocket() {
    this.socket = undefined;
  }

  joinRoom(room: Room) {
    this.room = room;
    this.room.addPlayer(this);
  }

  setName(name: string) {
    this.name = name;
  }

  leaveRoom() {
    this.room?.removePlayer(this);
    this.room = undefined;
  }

  log(...args: any[]) {
    console.log(`[${this.id}]`, ...args);
  }
}
