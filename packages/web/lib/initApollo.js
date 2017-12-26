/* global window */

import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { withClientState } from 'apollo-link-state';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getMainDefinition } from 'apollo-utilities'; // eslint-disable-line
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'isomorphic-unfetch';
import uuid from 'uuid/v4';
import CLIENT_ID from '@todomvc-subscriptions/constants/clientID';
import resolvers from '../modules/filter/resolvers';

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function createClientID() {
  const clientID = uuid();
  window.localStorage.setItem(CLIENT_ID, clientID);
  return clientID;
}

function create(initialState, clientID) {
  const cache = new InMemoryCache({
    // Remind: We don't use typename as dataId to avoid different typename with same id
    // ref: https://github.com/apollographql/apollo-client/tree/master/packages/apollo-cache-inmemory
    dataIdFromObject: obj => obj.id || obj.__typename, // TODO
  }).restore(initialState || {});

  const httpLink = new HttpLink({
    uri: process.env.API_DOMAIN, // Server URL (must be absolute)
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    headers: {
      'Apollo-Client-ID': clientID,
    },
  });

  const stateLink = withClientState({
    cache,
    ...resolvers,
  });

  let link;
  if (process.browser) {
    const wsClient = new SubscriptionClient(process.env.WEBSOCKET_DOMAIN, {
      reconnect: true,
    });
    const wsLink = new WebSocketLink(wsClient);
    link = ApolloLink.split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      ApolloLink.from([stateLink, httpLink]),
    );
  } else {
    link = ApolloLink.from([stateLink, httpLink]);
  }

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link,
    cache,
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    const clientID = createClientID();
    apolloClient = create(initialState, clientID);
  }

  return apolloClient;
}
