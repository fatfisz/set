'use strict';

const { nanoid } = require('nanoid');
const SocketIO = require('socket.io');

const { Room } = require('./Room');

const acceptedIds = new Set();
let userCount = 0;

exports.initSocketIO = function initSocketIO(server) {
  const io = SocketIO(server);
  const room = new Room();

  io.on('connect', (socket) => {
    let { sessionId } = socket.handshake.query;

    function setUp() {
      setUpSocket(socket, room);
    }

    if (acceptedIds.has(sessionId)) {
      setUp();
    } else {
      sessionId = nanoid();
      acceptedIds.add(sessionId);
      socket.emit('session id generated', sessionId);
    }

    userCount += 1;
    console.log(`User joined: ${sessionId} (${userCount} total)`);

    socket.on('session id received', (clientSessionId) => {
      if (clientSessionId !== sessionId) {
        socket.disconnect();
      }
      setUp();
    });

    socket.on('disconnect', () => {
      userCount -= 1;
      console.log(`User left: ${sessionId} (${userCount} total)`);
    });
  });
};

function setUpSocket(socket, room) {
  const { sessionId } = socket.handshake.query;

  function emitRoomStateChanged(everyone = false) {
    const roomState = room.getState();
    socket.emit('room state changed', roomState);
    if (everyone) {
      socket.broadcast.emit('room state changed', roomState);
    }
  }

  emitRoomStateChanged();

  socket.on('room joined', () => {
    emitRoomStateChanged();
  });

  socket.on('set selected', (cards) => {
    if (room.trySelectSet(sessionId, cards)) {
      emitRoomStateChanged(true);
    }
  });
}
