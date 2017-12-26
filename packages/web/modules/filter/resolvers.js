// @flow
import { SHOW_ALL, type Filter } from './constants';

export default {
  defaults: {
    filter: SHOW_ALL,
    // filter: {
    //   __typename: 'filter',
    //   value: 'SHOW_ALL',
    // },
    // todos: [],
  },
  resolvers: {
    // Query: {
    //   filter: (obj, args, { cache }, info)  => {
    //     console.log('Query', { obj, args, cache, info })
    //     console.log({ data: cache.data })
    //     return '12323';
    //   },
    // },
    Mutation: {
      updateFilter: (obj, { filter }: { filter: Filter }, { cache }) => {
        cache.writeData({ data: { filter } });
        return null;
      },
    },
  },
};
