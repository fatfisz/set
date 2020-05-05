import { AppProps } from 'next/app';

import { CardDefs } from 'components/CardDefs';
import { SocketContextProvider } from 'components/SocketContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
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
        }
      `}</style>
    </>
  );
}
