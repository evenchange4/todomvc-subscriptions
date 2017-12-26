/* eslint import/first: 0 */

require('dotenv').config();

import { GraphQLServer, PubSub } from 'graphql-yoga';
import * as R from 'ramda';
import CLIENT_ID from '@todomvc-subscriptions/constants/clientID';
import { typeDefs, resolvers, models, connector } from './todos';

const { PORT } = process.env;

async function run() {
  try {
    await connector.migrate.latest();
    await connector.seed.run();
    const pubsub = new PubSub();
    const server = new GraphQLServer({
      typeDefs,
      resolvers,
      context: ({ request }) =>
        Promise.resolve({
          Todos: models(connector),
          pubsub,
          clientID: R.path(['headers', CLIENT_ID])(request),
        }),
      options: {
        port: PORT,
        disablePlayground: false,
      },
    });

    await server.start();
  } catch (error) {
    console.log(error); // eslint-disable-line
    process.exit(1);
  }
}

run().then(() => console.log(`Server is running on http://localhost:${PORT}`)); // eslint-disable-line
