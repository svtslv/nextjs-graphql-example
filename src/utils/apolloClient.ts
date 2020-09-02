import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getItem } from './localStorage';

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
