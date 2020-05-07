import { useContext, useEffect, useState } from 'react';

import { SelectedCardsProvider } from 'components/SelectedCardsContext';
import { SocketContext } from 'components/SocketContext';
import { Table } from 'components/Table';
import { RoomState } from 'types/RoomState';

export default function Index() {
  const { onRoomStateChanged } = useContext(SocketContext);
  const [roomState, setRoomState] = useState<RoomState | undefined>();

  useEffect(() => {
    onRoomStateChanged(setRoomState);
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
