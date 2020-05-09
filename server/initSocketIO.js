'use strict';

const { nanoid } = require('nanoid');
const SocketIO = require('socket.io');

const { getRandomName } = require('./getRandomName');
const { Room } = require('./Room');

exports.initSocketIO = function initSocketIO(server) {
  const io = SocketIO(server);
  const names = new Map();
  const room = new Room();
  const acceptedIds = new Set();
  let userCount = 0;

  async function ensureName(sessionId) {
    if (!names.has(sessionId)) {
      names.set(sessionId, await getRandomName());
    }
    return names.get(sessionId);
  }

  io.on('connect', async (socket) => {
    const sessionId = ensureSessionId();
    let tearDown = () => {};

    function ensureSessionId() {
      const { sessionId } = socket.handshake.query;
      return acceptedIds.has(sessionId) ? sessionId : nanoid();
    }

    async function addNewPlayer(sessionId) {
      await ensureName(sessionId);
      acceptedIds.add(sessionId);
      room.players.add(sessionId);
    }

    function disconnectPlayer(sessionId) {
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
};

function setUpSocket(names, room, socket, sessionId) {
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
    console.log(name);
    // SET THE NAME
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
