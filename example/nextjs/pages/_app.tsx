import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script
          // Is uuidv4 a good project id? Is that much randomity required?
          data-projectid="4500edc7-0d58-4617-9117-17186c4e9b6f"
          dangerouslySetInnerHTML={{
            __html: process.env.tracker as string,
          }}
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
