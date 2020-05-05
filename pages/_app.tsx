import { AppProps } from 'next/app';

import { CardDefs } from 'components/CardDefs';
import { SessionContextProvider } from 'components/SessionContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CardDefs />
      <SessionContextProvider>
        <Component {...pageProps} />
      </SessionContextProvider>

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
