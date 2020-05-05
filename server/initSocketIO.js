'use strict';

const { nanoid } = require('nanoid');
const SocketIO = require('socket.io');

const acceptedIds = new Set();
let userCount = 0;

exports.initSocketIO = function initSocketIO(server) {
  const io = SocketIO(server);

  io.on('connect', (socket) => {
    let { sessionId } = socket.handshake.query;

    if (acceptedIds.has(sessionId)) {
      setUpSocket(socket);
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
      setUpSocket(socket);
    });

    socket.on('disconnect', () => {
      userCount -= 1;
      console.log(`User left: ${sessionId} (${userCount} total)`);
    });
  });
};

function setUpSocket(socket) {
  socket.emit('room joined', [
    { color: 'green', number: 1, shade: 'open', shape: 'diamond' },
    // { color: 'purple', number: 2, shade: 'striped', shape: 'squiggle' },
    undefined,
    { color: 'red', number: 3, shade: 'solid', shape: 'oval' },
    // { color: 'green', number: 1, shade: 'open', shape: 'diamond' },
    // { color: 'purple', number: 2, shade: 'striped', shape: 'squiggle' },
    // { color: 'red', number: 3, shade: 'solid', shape: 'oval' },
    undefined,
    undefined,
    undefined,
    { color: 'green', number: 1, shade: 'open', shape: 'diamond' },
    // { color: 'purple', number: 2, shade: 'striped', shape: 'squiggle' },
    undefined,
    { color: 'red', number: 3, shade: 'solid', shape: 'oval' },
    { color: 'green', number: 1, shade: 'open', shape: 'diamond' },
    // { color: 'purple', number: 2, shade: 'striped', shape: 'squiggle' },
    undefined,
    { color: 'red', number: 3, shade: 'solid', shape: 'oval' },
    { color: 'red', number: 3, shade: 'solid', shape: 'oval' },
  ]);
}
