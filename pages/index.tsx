import { useContext, useEffect, useState } from 'react';

import { SocketContext } from 'components/SocketContext';
import { Table } from 'components/Table';
import { TableStateProvider } from 'components/TableStateContext';

export default function Index() {
  const { onRoomJoined } = useContext(SocketContext);
  const [cards, setCards] = useState<number[]>();

  useEffect(() => {
    onRoomJoined(setCards);
  }, []);

  return (
    <TableStateProvider>
      <Table cards={cards} />
    </TableStateProvider>
  );
}
