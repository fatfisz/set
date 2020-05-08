import Head from 'next/head';

export function Title({ title }: { title?: string }) {
  return (
    <Head>
      <title>{title && `${title} - `}The Game of Set</title>
    </Head>
  );
}
