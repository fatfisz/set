import { useContext, useEffect, useState } from 'react';

import { SelectedCardsProvider } from 'components/SelectedCardsContext';
import { SocketContext } from 'components/SocketContext';
import { Status } from 'components/Status';
import { Table } from 'components/Table';
import { RoomState } from 'types/RoomState';

export default function Index() {
  const { joinRoom, onRoomStateChanged } = useContext(SocketContext);
  const [roomState, setRoomState] = useState<RoomState | undefined>();

  useEffect(() => {
    joinRoom();
    const removeListener = onRoomStateChanged(setRoomState);
    return () => {
      removeListener();
    };
  }, []);

  if (!roomState) {
    return null;
  }

  return (
    <>
      <div className="window">
        <SelectedCardsProvider>
          <Table cards={roomState.cards} />
        </SelectedCardsProvider>
        <Status
          remainingCardCount={roomState.remainingCardCount}
          scores={roomState.scores}
        />
      </div>

      <style jsx>{`
        .window {
          display: grid;
          grid-template-columns: 1fr 300px;
          height: 100%;
          left: 0;
          position: fixed;
          top: 0;
          width: 100%;
        }
      `}</style>
    </>
  );
}
