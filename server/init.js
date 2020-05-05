'use strict';

const { createServer } = require('http');
const next = require('next');

const { initSocketIO } = require('./initSocketIO');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev,
  conf: {
    typescript: {
      ignoreDevErrors: true,
    },
  },
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(handle);

  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log('> Ready on http://localhost:3000');
  });

  initSocketIO(server);
});
