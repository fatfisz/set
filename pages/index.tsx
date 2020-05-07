import { useContext, useEffect, useState } from 'react';

import { SocketContext } from 'components/SocketContext';
import { Table } from 'components/Table';
import { TableStateProvider } from 'components/TableStateContext';
import { RoomState } from 'types/RoomState';

export default function Index() {
  const { onRoomStateChanged } = useContext(SocketContext);
  const [roomState, setRoomState] = useState<RoomState | undefined>();

  useEffect(() => {
    onRoomStateChanged(setRoomState);
  }, []);

  return (
    <TableStateProvider>
      <Table cards={roomState?.cards} />
    </TableStateProvider>
  );
}
