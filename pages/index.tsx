import Link from 'next/link';
import { useContext } from 'react';

import { SocketContext } from 'components/SocketContext';
import { translucentBlack } from 'config/colors';

export default function Index() {
  const { createRoom, lobbyState } = useContext(SocketContext);

  if (!lobbyState) {
    return null;
  }

  return (
    <>
      <div className="spacing-wrapper">
        <div className="lobby">
          <h1>Set</h1>
          {lobbyState.rooms.map((room) => (
            <Link key={room.id} href="/room/[id]" as={`/room/${room.id}`}>
              <a>{room.name}</a>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .spacing-wrapper {
          align-items: center;
          display: flex;
          flex-direction: column;
          padding: 64px 0;
        }

        .lobby {
          background-color: ${translucentBlack};
          border-radius: 32px;
          padding: 32px;
          min-height: 420px;
          width: 500px;
        }
      `}</style>
    </>
  );
}

/**
 * - list the rooms
 * - add a room (name - automatic by default, options: { autoAddCard, password (optional) })
 */
