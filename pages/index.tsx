import { useContext, useEffect, useState } from 'react';

import { SocketContext } from 'components/SocketContext';
import { Table } from 'components/Table';
import { TableStateProvider } from 'components/TableStateContext';
import { MaybeCardDescription } from 'types/Card';

export default function Index() {
  const { onRoomJoined } = useContext(SocketContext);
  const [cards, setCards] = useState<MaybeCardDescription[] | undefined>();

  useEffect(() => {
    onRoomJoined(setCards);
  }, []);

  return (
    <TableStateProvider>
      <Table cards={cards} />
    </TableStateProvider>
  );
}
