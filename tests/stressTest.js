'use strict';

const io = require('socket.io-client');

const testSize = 1000000;

test();

async function test() {
  for (let count = 0; count < testSize; count += 1) {
    if (getProgress(count - 1, testSize) !== getProgress(count, testSize)) {
      console.log(getProgress(count, testSize));
    }
    await singleTest();
  }
}

function singleTest() {
  return new Promise((resolve) => {
    const socket = io(`http://localhost:3001`);

    socket.on('connect', () => {
      socket.close();
    });

    socket.on('disconnect', () => {
      resolve();
    });
  });
}

function getProgress(count, size) {
  return `${(((count + 1) / size) * 100).toFixed(2)}%`;
}
