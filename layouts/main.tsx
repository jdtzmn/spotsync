import * as React from 'react'
import Head from 'next/head'

const main = ({ children }) => {
  return (
    <div>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
      </Head>
      {children}
    </div>
  );
};

export default main
