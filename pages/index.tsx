import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { Table } from 'components/Table';
import { TableStateProvider } from 'components/TableStateContext';
import { MaybeCardDescription } from 'types/Card';

export default function Index() {
  const [cards, setCards] = useState<MaybeCardDescription[]>([]);

  useEffect(() => {
    const socket = io();
    socket.on('room joined', (cards: MaybeCardDescription[]) => {
      setCards(cards.map((card) => (card === null ? undefined : card)));
    });
  }, []);

  return (
    <TableStateProvider>
      <Table cards={cards} />
    </TableStateProvider>
  );
}
