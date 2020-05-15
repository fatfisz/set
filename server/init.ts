import SocketIO from 'socket.io';

import { server } from 'server';
import { ServerEvents } from 'shared/types/ServerEvents';
import { ServerSocket } from 'shared/types/Socket';
import { State } from 'State';

const state = new State();
const io = SocketIO(server);

io.on('connect', (socket: ServerSocket<ServerEvents>) => {
  state.addSocket(socket);
});
