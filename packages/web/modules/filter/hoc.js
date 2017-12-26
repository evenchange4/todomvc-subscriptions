// @flow
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FILTER_QUERY, UPDATE_FILTER_MUTATION } from './gql';
import { type Filter } from './constants';

/**
 * Query
 */
export type WithFilter<Props: {}> = (
  Component: React.ComponentType<Props>,
) => React.ComponentType<$Diff<Props, { filter: { filter: Filter } }>>;
export const withFilter: WithFilter<*> = graphql(FILTER_QUERY, {
  alias: 'withFilter',
  props: ({ data }) => ({
    filter: data,
  }),
});

/**
 * Update
 */
export type UpdateFilter = (filter: Filter) => void;
export type WithUpdateFilter<Props: {}> = (
  Component: React.ComponentType<Props>,
) => React.ComponentType<$Diff<Props, { updateFilter: UpdateFilter }>>;
export const withUpdateFilter: WithUpdateFilter<*> = graphql(
  UPDATE_FILTER_MUTATION,
  {
    alias: 'withUpdateFilter',
    props: ({ mutate }) => ({
      updateFilter: filter =>
        mutate({
          variables: { filter },
        }),
    }),
  },
);
