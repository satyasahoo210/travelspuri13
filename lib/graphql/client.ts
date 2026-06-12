import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const isServer = typeof window === 'undefined';
const uri = isServer
  ? `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/graphql`
  : '/api/v1/graphql';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri,
  }),
  cache: new InMemoryCache(),
});
