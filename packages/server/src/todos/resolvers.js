import { withFilter } from 'graphql-yoga';
import * as R from 'ramda';
import ACTIONS from '@todomvc-subscriptions/constants/actions';

const CHANNEL_TODOS_CHANGED = 'CHANNEL_TODOS_CHANGED';

export default {
  Query: {
    todos: (obj, args, { Todos }) => Todos.getAll(),
  },
  Mutation: {
    createTodo: async (obj, { title }, { Todos, pubsub, clientID }) => {
      const [id] = await Todos.create(title);
      const todo = await Todos.findById(id);
      pubsub.publish(CHANNEL_TODOS_CHANGED, {
        action: { payload: [todo], type: ACTIONS.CREATE },
        clientID,
      });
      return todo;
    },
    updateTodo: async (obj, { payload }, { Todos, pubsub, clientID }) => {
      await Todos.update(payload);
      const todo = await Todos.findById(payload.id);
      pubsub.publish(CHANNEL_TODOS_CHANGED, {
        action: { payload: [todo], type: ACTIONS.UPDATE },
        clientID,
      });
      return todo;
    },
    toggleAll: async (obj, { completed }, { Todos, pubsub, clientID }) => {
      await Todos.toggleAll(completed);
      // TODO: what payload should web publish?
      pubsub.publish(CHANNEL_TODOS_CHANGED, {
        action: {
          payload: [{ id: 'fake', completed }],
          type: ACTIONS.TOGGLE_ALL,
        },
        clientID,
      });
      return { completed };
    },
    deleteTodos: async (obj, { ids }, { Todos, pubsub, clientID }) => {
      await Todos.deleteTodos(ids);
      pubsub.publish(CHANNEL_TODOS_CHANGED, {
        action: {
          payload: ids.map(id => ({ id })),
          type: ACTIONS.DELETE,
        },
        clientID,
      });
      return ids;
    },
  },
  Subscription: {
    todoChanged: {
      resolve: R.prop('action'),
      subscribe: withFilter(
        (obj, args, { pubsub }) => pubsub.asyncIterator(CHANNEL_TODOS_CHANGED),
        (payload, variables) => payload.clientID !== variables.filter,
      ),
    },
  },
};
