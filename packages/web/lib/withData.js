// @flow
import * as React from 'react';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import Head from 'next/head';
import initApollo from './initApollo';

type Props = {|
  serverState: {
    apollo: {
      data: any,
    },
  },
|};
type Ctx = {
  asPath: string,
  pathname: string,
  query: string,
};
type Component = React.ComponentType<any>;

// Gets the display name of a JSX component for dev tools
function getComponentDisplayName(BaseComponent: Component): string {
  return BaseComponent.displayName || BaseComponent.name || 'Unknown';
}

export default (BaseComponent: Component) =>
  class WithData extends React.Component<Props> {
    static displayName = `WithData(${getComponentDisplayName(BaseComponent)})`;

    static async getInitialProps(ctx: Ctx) {
      // Initial serverState with apollo (empty)
      let serverState = {
        apollo: {
          data: {},
        },
      };

      // Evaluate the composed component's getInitialProps()
      let composedInitialProps = {};
      if (BaseComponent.getInitialProps) {
        composedInitialProps = await BaseComponent.getInitialProps(ctx);
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      if (!process.browser) {
        const apollo = initApollo();

        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <ApolloProvider client={apollo}>
              <BaseComponent {...composedInitialProps} />
            </ApolloProvider>,
            {
              router: {
                asPath: ctx.asPath,
                pathname: ctx.pathname,
                query: ctx.query,
              },
            },
          );
        } catch (error) {
          console.log('getDataFromTree', { error }); // eslint-disable-line
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
        }
        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();

        // Extract query data from the Apollo store
        serverState = {
          apollo: {
            data: apollo.cache.extract(),
          },
        };
      }

      return {
        serverState,
        ...composedInitialProps,
      };
    }

    constructor(props: Props) {
      super(props);
      this.apollo = initApollo(this.props.serverState.apollo.data);
    }

    render() {
      return (
        <ApolloProvider client={this.apollo}>
          <BaseComponent {...this.props} />
        </ApolloProvider>
      );
    }
  };
