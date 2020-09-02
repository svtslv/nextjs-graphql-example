import React from 'react';
import Head from 'next/head';

type PropsType = {
  title: string;
  className: string;
};

export const PageHeader = ({ title, className }: PropsType) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={className}>{title}</div>
    </>
  );
};
