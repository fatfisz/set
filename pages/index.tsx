import { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

import { SessionContext } from 'components/SessionContext';
import { Table } from 'components/Table';
import { TableStateProvider } from 'components/TableStateContext';
import { MaybeCardDescription } from 'types/Card';

export default function Index() {
  const { sessionId } = useContext(SessionContext);
  const [cards, setCards] = useState<MaybeCardDescription[] | undefined>();

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const socket = io({ query: { sessionId } });

    socket.on('room joined', (cards: MaybeCardDescription[]) => {
      setCards(cards.map((card) => (card === null ? undefined : card)));
    });
  }, [sessionId]);

  return (
    <TableStateProvider>
      <Table cards={cards} />
    </TableStateProvider>
  );
}
