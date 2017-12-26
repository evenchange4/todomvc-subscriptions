/* eslint import/no-extraneous-dependencies: 0 */

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

/**
 * ref: https://github.com/apollographql/apollo-link/blob/master/packages/apollo-link-schema/README.md
 */
const mockClient = ({ typeDefs, mocks, cache }) => {
  const schema = makeExecutableSchema({ typeDefs });
  addMockFunctionsToSchema({
    schema,
    mocks,
  });

  return new ApolloClient({
    cache:
      cache ||
      new InMemoryCache({
        dataIdFromObject: obj => obj.id || obj.__typename, // eslint-disable-line
      }),
    link: new SchemaLink({ schema }),
  });
};

export default mockClient;
