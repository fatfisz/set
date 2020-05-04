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
        }
      `}</style>
    </>
  );
}
