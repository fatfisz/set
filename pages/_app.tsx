import classNames from 'classnames';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';

import { CardDefs } from 'components/CardDefs';
import { SocketContext, SocketProvider } from 'components/SocketContext';
import { Spinner } from 'components/Spinner';
import { Title } from 'components/Title';
import * as colors from 'config/colors';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&amp;display=swap"
          rel="stylesheet"
        />
      </Head>

      <Title />

      <CardDefs />

      <SocketProvider>
        <Component {...pageProps} />
        <ServerConnectivityIndicator />
      </SocketProvider>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-image: url('/static/table-background.jpg');
          background-position: top;
          background-size: cover;
          color: white;
          font-family: 'Lato', sans-serif;
        }

        a {
          color: inherit;
        }
      `}</style>
    </>
  );
}

function ServerConnectivityIndicator() {
  const { ready } = useContext(SocketContext);
  const [clientRendered, setClientRendered] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => setClientRendered(true), 1000);
    return () => {
      clearTimeout(handle);
    };
  }, []);

  return (
    <>
      <div
        className={classNames('indicator', {
          hidden: ready || !clientRendered,
        })}
      >
        <h1>Connecting</h1>
        <Spinner size={32} />
      </div>

      <style jsx>{`
        .indicator {
          align-items: center;
          background-color: ${colors.translucentBlack};
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(2, max-content);
          height: 100%;
          justify-content: center;
          left: 0;
          opacity: 1;
          position: fixed;
          user-select: none;
          top: 0;
          transform: scale(1, 1);
          transition-delay: 0s, 0s;
          transition-duration: 200ms, 0s;
          transition-property: opacity, transform;
          width: 100%;
        }

        .hidden {
          opacity: 0;
          transform: scale(0, 0);
          transition-delay: 0s, 200ms;
        }
      `}</style>
    </>
  );
}
