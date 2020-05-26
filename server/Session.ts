import * as sessionCollection from 'collections/sessionCollection';
import { DatabaseSchema } from 'DatabaseSchema';
import { getPseudoUniqueId } from 'getPseudoUniqueId';
import { getRandomName } from 'getRandomName';
import { Room } from 'Room';
import { ServerEvents } from 'shared/types/ServerEvents';
import { SessionState } from 'shared/types/SessionState';
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
    id,
    name = getRandomName(),
    socket,
  }: {
    id?: string;
    name?: string;
    socket?: ServerSocket<ServerEvents>;
  }) {
    this.id = id ?? getPseudoUniqueId();
    this.name = name;
    if (socket) {
      this.setSocket(socket);
    }

    if (!id) {
      sessionCollection.insertOne(this.serialize());
    }
  }

  serialize(): DatabaseSchema['session'] {
    return {
      id: this.id,
      name: this.name,
    };
  }

  static deserialize(data: DatabaseSchema['session']): Session {
    return new Session(data);
  }

  getState(): SessionState {
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
    sessionCollection.updateOne(this.id, { $set: { name } });
  }

  leaveRoom() {
    this.room?.removePlayer(this);
    this.room = undefined;
  }
}
