import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { Drawer } from 'components/Drawer';
import { SelectedCardsProvider } from 'components/SelectedCardsContext';
import { SocketContext } from 'components/SocketContext';
import { Table } from 'components/Table';

export default function Room() {
  const { id } = useRouter().query;
  const { joinRoom, leaveRoom, roomState } = useContext(SocketContext);

  useEffect(() => {
    joinRoom(typeof id === 'string' ? id : '');
    return leaveRoom;
  }, [id, joinRoom, leaveRoom]);

  if (!roomState) {
    return null;
  }

  return (
    <>
      <div className="window">
        <SelectedCardsProvider>
          <Table cards={roomState.cards} />
        </SelectedCardsProvider>
        <Drawer
          options={roomState.options}
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
