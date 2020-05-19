import Link from 'next/link';
import { useContext } from 'react';

import { FloatingContent } from 'components/FloatingContent';
import { SocketContext } from 'components/SocketContext';

export default function Index() {
  const { lobbyState } = useContext(SocketContext);

  if (!lobbyState) {
    return null;
  }

  return (
    <FloatingContent>
      <h1>Set</h1>

      <Link href="/room/create">
        <a>Create room</a>
      </Link>

      {lobbyState.rooms.map((room) => (
        <Link key={room.id} href="/room/[id]" as={`/room/${room.id}`}>
          <a>{room.name}</a>
        </Link>
      ))}
    </FloatingContent>
  );
}
