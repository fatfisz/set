import SocketIO from 'socket.io';

import { getServer } from 'server';
import { ServerEvents } from 'shared/types/ServerEvents';
import { ServerSocket } from 'shared/types/Socket';
import { State } from 'State';

main();

async function main() {
  const state = new State();
  const server = getServer();
  const io = SocketIO(server);
  io.on('connect', (socket: ServerSocket<ServerEvents>) => {
    state.addSocket(socket);
  });
}
