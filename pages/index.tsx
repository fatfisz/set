import { useContext, useEffect, useState } from 'react';

import { SelectedCardsProvider } from 'components/SelectedCardsContext';
import { SocketContext } from 'components/SocketContext';
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
      <SelectedCardsProvider>
        <Table cards={roomState.cards} />
      </SelectedCardsProvider>
    </>
  );
}
