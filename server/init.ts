import { createServer } from 'http';

import { nanoid } from 'nanoid';
import SocketIO from 'socket.io';

import { getRandomName } from 'getRandomName';
import { Room } from 'Room';
import { serverPort } from 'shared/serverPort';
import { ServerEvents } from 'shared/types/ServerEvents';
import { ServerSocket } from 'shared/types/Socket';

const server = createServer();

server.listen(serverPort, () => {
  console.log(`> Ready on http://localhost:${serverPort}`);
});

const io = SocketIO(server);
const names = new Map<string, string>();
const room = new Room();
const acceptedIds = new Set<string>();
let userCount = 0;

io.on('connect', async (socket: ServerSocket<ServerEvents>) => {
  const sessionId = ensureSessionId();
  let tearDown = () => {};

  function ensureSessionId() {
    const { sessionId } = socket.handshake.query;
    return acceptedIds.has(sessionId) ? sessionId : nanoid();
  }

  async function addNewPlayer(sessionId: string) {
    await ensureName(sessionId);
    acceptedIds.add(sessionId);
    room.players.add(sessionId);
  }

  function disconnectPlayer(sessionId: string) {
    room.players.delete(sessionId);
    tearDown();
  }

  socket.emit('session id generated', sessionId);

  userCount += 1;
  console.log(`User joined: ${sessionId} (${userCount} total)`);

  socket.on('session id received', async (clientSessionId) => {
    if (clientSessionId !== sessionId) {
      socket.disconnect();
    }
    await addNewPlayer(sessionId);
    tearDown = setUpSocket(names, room, socket, sessionId);
  });

  socket.on('disconnect', () => {
    disconnectPlayer(sessionId);
    userCount -= 1;
    console.log(`User left: ${sessionId} (${userCount} total)`);
  });
});

async function ensureName(sessionId: string) {
  if (!names.has(sessionId)) {
    names.set(sessionId, await getRandomName());
  }
  return names.get(sessionId);
}

function setUpSocket(
  names: Map<string, string>,
  room: Room,
  socket: ServerSocket<ServerEvents>,
  sessionId: string
) {
  function emitRoomStateChanged(everyone = false) {
    const roomState = room.getState(names);
    socket.emit('room state changed', roomState);
    if (everyone) {
      socket.broadcast.emit('room state changed', roomState);
    }
  }

  emitRoomStateChanged(true);

  socket.on('add next card', () => {
    room.requestNextCard(sessionId);
    emitRoomStateChanged(true);
  });

  socket.on('room joined', () => {
    emitRoomStateChanged();
  });

  socket.on('name set', (name) => {
    names.set(sessionId, name);
    emitRoomStateChanged(true);
  });

  socket.on('set selected', (cards) => {
    if (room.trySelectSet(sessionId, cards)) {
      emitRoomStateChanged(true);
    }
  });

  return () => {
    emitRoomStateChanged(true);
  };
}
