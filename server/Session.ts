import { DatabaseSchema } from 'DatabaseSchema';
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

  constructor(initialData: {
    id?: never;
    name?: never;
    socket: ServerSocket<ServerEvents>;
  });
  constructor(initialData: { id: string; name: string; socket?: never });
  constructor({
    id = getPseudoUniqueId(),
    name = getRandomName(),
    socket,
  }: {
    id?: string;
    name?: string;
    socket?: ServerSocket<ServerEvents>;
  }) {
    this.id = id;
    this.name = name;
    if (socket) {
      this.setSocket(socket);
    }
  }

  static deserialize(data: DatabaseSchema['session']): Session {
    return new Session(data);
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
