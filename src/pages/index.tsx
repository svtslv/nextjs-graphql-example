import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

// noinspection JSUnusedGlobalSymbols
export default function MainIndex() {
  return (
    <div>
      <Head>
        <title>NextJs - MainIndex</title>
      </Head>
      <div className="flex -m-2 flex-wrap">
        <Link href="/users">
          <a className="w-32 h-32 m-2 bg-white rounded border flex justify-center items-center">Users</a>
        </Link>
        <Link href="/categories">
          <a className="w-32 h-32 m-2 bg-white rounded border flex justify-center items-center">Categories</a>
        </Link>
        <Link href="/products">
          <a className="w-32 h-32 m-2 bg-white rounded border flex justify-center items-center">Products</a>
        </Link>
      </div>
    </div>
  );
}
