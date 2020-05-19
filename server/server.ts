import { createServer } from 'http';

import { serverPort } from 'shared/serverPort';

export function getServer() {
  const server = createServer();

  server.listen(serverPort, () => {
    console.log(`> Ready on http://localhost:${serverPort}`);
  });

  return server;
}
