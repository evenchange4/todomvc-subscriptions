// @flow
import gql from 'graphql-tag';

export const FILTER_QUERY = gql`
  query filterQuery {
    filter @client
  }
`;

export const UPDATE_FILTER_MUTATION = gql`
  mutation updateFilterMutation($filter: String!) {
    updateFilter(filter: $filter) @client
  }
`;
