import SocketIO from 'socket.io';

import { getServer } from 'server';
import { patchSocket } from 'shared/patchSocket';
import { State } from 'State';

main();

async function main() {
  const state = new State();
  await state.initFromDb();
  const server = getServer();
  const io = SocketIO(server);
  io.on('connect', (socket) => {
    state.addSocket(patchSocket(socket));
  });
}
