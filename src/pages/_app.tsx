import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../utils/apolloClient';
import { NoSSR } from '../components/NoSSR';
import { SiteLayout } from '../components/SiteLayout';
import { AuthProvider } from '../components/AuthProvider';
import 'antd/dist/antd.min.css';
import '../styles/globals.css';

// noinspection JSUnusedGlobalSymbols
export default function MyApp({ Component, pageProps }) {
  return (
    <NoSSR>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <SiteLayout>
            <Component {...pageProps} />
          </SiteLayout>
        </AuthProvider>
      </ApolloProvider>
    </NoSSR>
  );
}
