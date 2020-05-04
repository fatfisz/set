import { AppProps } from 'next/app';

import { CardDefs } from 'components/CardDefs';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CardDefs />
      <Component {...pageProps} />

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-image: url('/static/table-background.jpg');
          background-position: center;
          background-size: cover;
        }
      `}</style>
    </>
  );
}
