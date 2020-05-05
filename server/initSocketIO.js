'use strict';

const SocketIO = require('socket.io');

exports.initSocketIO = function initSocketIO(server) {
  const io = SocketIO(server);

  let userCount = 0;

  io.on('connect', (socket) => {
    const { sessionId } = socket.handshake.query;

    if (typeof sessionId === 'undefined') {
      return;
    }

    userCount += 1;
    console.log(`User joined: ${sessionId} (${userCount} total)`);

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

    socket.on('disconnect', () => {
      userCount -= 1;
      console.log(`User left: ${sessionId} (${userCount} total)`);
    });
  });
};
