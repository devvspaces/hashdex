import { ApolloClient, InMemoryCache, ApolloProvider, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth } from './AuthContext';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_HASHNODE_API_URL
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('pat');
  return {
    headers: {
      ...headers,
      Authorization: `${token}`
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default client;
