import { createServer } from 'http';

import { serverPort } from 'shared/serverPort';

export const server = createServer();

server.listen(serverPort, () => {
  console.log(`> Ready on http://localhost:${serverPort}`);
});
