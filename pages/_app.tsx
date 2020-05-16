import { AppProps } from 'next/app';
import Head from 'next/head';

import { CardDefs } from 'components/CardDefs';
import { SocketProvider } from 'components/SocketContext';
import { Title } from 'components/Title';

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
