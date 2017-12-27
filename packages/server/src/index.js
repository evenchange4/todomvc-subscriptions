/* eslint import/first: 0 */

require('dotenv').config();

import { GraphQLServer, PubSub } from 'graphql-yoga';
import * as R from 'ramda';
import CLIENT_ID from '@todomvc-subscriptions/constants/clientID';
import { Engine } from 'apollo-engine';
import compression from 'compression';
import { typeDefs, resolvers, models, connector } from './todos';

const { PORT, PROXY_PORT, APOLLO_ENGINE_KEY } = process.env;

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
        tracing: true,
      },
    });

    /**
     * Apollo Engine
     * ref: https://github.com/graphcool/graphql-yoga/issues/5#issuecomment-351695388
     */
    const engine = new Engine({
      engineConfig: {
        apiKey: APOLLO_ENGINE_KEY,
        logging: {
          level: 'INFO',
        },
        origins: [
          {
            http: {
              url: `http://localhost:${PORT}`,
            },
          },
        ],
        frontends: [
          {
            host: '0.0.0.0',
            port: parseInt(PROXY_PORT, 10),
            endpoint: '/',
          },
        ],
      },
    });
    engine.start();
    server.express.use(compression());
    server.express.use(engine.expressMiddleware());

    await server.start();
  } catch (error) {
    console.log(error); // eslint-disable-line
    process.exit(1);
  }
}

run().then(() =>
  console.log(`Proxy Server is running on http://localhost:${PROXY_PORT}`),
); // eslint-disable-line
