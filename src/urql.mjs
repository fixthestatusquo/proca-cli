import { createClient, gql, cacheExchange, fetchExchange } from 'urql';

// Create a URQL client with your GraphQL API endpoint
const client = createClient({
  url: 'https://api.proca.app/api',
  exchanges:  [
  cacheExchange,   // Handles caching
  fetchExchange    // Handles fetching
]
});

const query = async (query, payload)=> { 
  const result = await client.query(query,payload).toPromise();
  if (result.error)
    throw new Error (result);
  return result.data;
}

export { client, query, gql }
