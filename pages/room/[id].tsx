import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { Drawer } from 'components/Drawer';
import { FloatingContent } from 'components/FloatingContent';
import { SelectedCardsProvider } from 'components/SelectedCardsContext';
import { SocketContext } from 'components/SocketContext';
import { Table } from 'components/Table';
import { pageRedirectionTimeout } from 'config/pageRedirectionTimeout';

export default function Room() {
  const { id } = useRouter().query;
  const [notFound, setNotFound] = useState(false);
  const { joinRoom, leaveRoom, roomState } = useContext(SocketContext);

  useEffect(() => {
    let didCancel = false;
    async function run() {
      const success = await joinRoom(typeof id === 'string' ? id : '');
      if (!didCancel && success === false) {
        setNotFound(true);
      }
    }
    run();
    return () => {
      didCancel = true;
      leaveRoom();
    };
  }, [id, joinRoom, leaveRoom]);

  if (notFound) {
    return <NotFound />;
  }

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

function NotFound() {
  const router = useRouter();

  useEffect(() => {
    let didCancel = false;
    const timeoutHandle = setTimeout(() => {
      if (!didCancel) {
        router.push('/');
      }
    }, pageRedirectionTimeout);
    return () => {
      didCancel = true;
      clearTimeout(timeoutHandle);
    };
  }, []);

  return (
    <FloatingContent>
      <h1>The room does not exist</h1>
      <p>You will be redirected to the lobby in a few seconds.</p>
    </FloatingContent>
  );
}
