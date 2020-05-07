import { AppProps } from 'next/app';
import Head from 'next/head';

import { CardDefs } from 'components/CardDefs';
import { SocketContextProvider } from 'components/SocketContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>The Game of Set</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&amp;display=swap"
          rel="stylesheet"
        />
      </Head>

      <CardDefs />
      <SocketContextProvider>
        <Component {...pageProps} />
      </SocketContextProvider>

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
      `}</style>
    </>
  );
}
