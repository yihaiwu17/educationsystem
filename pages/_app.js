import React from 'react';
import '../styles/globals.css';
import Head from 'next/head';
import '../styles/antd.less';
import { makeServer } from '../mock/mirage';
import { MessageProvider } from '../lib/provider';

if (process.env.NODE_ENV === 'development') {
  makeServer({ environment: 'development' });
}

function MyApp({ Component, pageProps }){

    return (
      <>
        <Head>
          <meta charSet="utf-8" />
          <title>Online Education</title>
          <meta key="description" name="description" content="Online Education System" />
        </Head>
        <MessageProvider>
          <Component {...pageProps} />
        </MessageProvider>
      </>
    );
  }


export default MyApp;
