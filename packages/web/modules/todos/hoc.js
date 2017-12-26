/* eslint no-underscore-dangle: ["error", { "allow": ["__"] }] */
// @flow
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as R from 'ramda';
import ACTIONS from '@todomvc-subscriptions/constants/actions';
import {
  TODOS_QUERY,
  CREATE_TODO_MUTATION,
  EDIT_TODO_MUTATION,
  TOGGLE_TODO_MUTATION,
  TOGGLE_ALL_MUTATION,
  DELETE_TODOS_MUTATION,
  TODO_SUBSCRIPTION,
} from './gql';

/**
 * Query HOC
 */
export type Todo = {
  id: string,
  completed: boolean,
  title: string,
};
export type Todos = {
  todos: Array<Todo>,
};
export type SubscribeTodoChanged = (clientID: string) => void;
export type WithTodos<Props: {}> = (
  Component: React.ComponentType<Props>,
) => React.ComponentType<
  $Diff<
    Props,
    {
      todos: Todos,
      subscribeTodoChanged: SubscribeTodoChanged,
    },
  >,
>;
export const withTodos: WithTodos<*> = graphql(TODOS_QUERY, {
  alias: 'withTodos',
  props: ({ data }) => ({
    todos: data,
    subscribeTodoChanged: clientID =>
      data.subscribeToMore({
        document: TODO_SUBSCRIPTION,
        variables: { filter: clientID },
        updateQuery: (
          { todos },
          {
            subscriptionData: {
              errors,
              data: { todoChanged: { payload, type } },
            },
          },
        ) => {
          if (errors) console.log({ errors });

          // Remind: this is a reducer by type
          switch (type) {
            case ACTIONS.CREATE: {
              const index = R.findIndex(R.propEq('id', payload[0].id))(todos);
              if (index === -1) {
                return { todos: R.prepend(payload[0])(todos) };
              }
              console.log('[ACTIONS.CREATE] duplicated key?');
              return { todos };
            }
            case ACTIONS.UPDATE: {
              const index = R.findIndex(R.propEq('id', payload[0].id))(todos);
              return { todos: R.adjust(R.merge(R.__, payload), index)(todos) };
            }
            case ACTIONS.DELETE: {
              // TODO: slow 3G will cause some problem. Should we remove negative id?
              const ids = R.pluck('id')(payload);
              return { todos: R.filter(todo => !ids.includes(todo.id))(todos) };
            }
            case ACTIONS.TOGGLE_ALL: {
              const { completed } = payload[0];
              // const index = R.findIndex(R.propEq('id', payload[0].id))(todos);
              const setItem = R.set(R.lensProp('completed'), completed);

              return { todos: R.map(setItem)(todos) };
            }
            default:
              return todos;
          }
        },
      }),
  }),
});

/**
 * Create HOC
 */
export type CreateTodo = ({ title: string }) => void;
export type WithCreateTodo<Props: {}> = (
  Component: React.ComponentType<Props>,
) => React.ComponentType<$Diff<Props, { createTodo: CreateTodo }>>;
export const withCreateTodo: WithCreateTodo<*> = graphql(CREATE_TODO_MUTATION, {
  alias: 'withCreateTodo',
  props: ({ mutate }) => ({
    createTodo: ({ title }): CreateTodo =>
      mutate({
        variables: { title },
        optimisticResponse: {
          __typename: 'Mutation',
          createTodo: {
            __typename: 'Todo',
            id: Math.round(Math.random() * -1000000), // Remind: fake item with negative id
            title,
            completed: false,
          },
        },
        update: (proxy, { data: { createTodo } }) => {
          const prevState = proxy.readQuery({ query: TODOS_QUERY });
          const lens = R.lensProp('todos');
          const data = R.over(lens, R.prepend(createTodo))(prevState);
          proxy.writeQuery({ query: TODOS_QUERY, data });
        },
      }),
  }),
});

/**
 * Edit HOC
 */
export type EditTodo = ({ id: string, title: string }) => void;
export type WithEditTodo<Props: {}> = (
  Component: React.ComponentType<Props>,
) => React.ComponentType<$Diff<Props, { editTodo: EditTodo }>>;
export const withEditTodo: WithEditTodo<*> = graphql(EDIT_TODO_MUTATION, {
  alias: 'withEditTodo',
  props: ({ mutate }) => ({
    editTodo: ({ id, title }) =>
      mutate({
        variables: { id, title },
        optimisticResponse: {
          __typename: 'Mutation',
          updateTodo: {
            __typename: 'Todo',
            id,
            title,
          },
        },
      }),
  }),
});

/**
 * Toggle HOC
 */
export type ToggleTodo = ({ id: string, completed: boolean }) => void;
export type WithToggleTodo<Props: {}> = (
  Component: React.ComponentType<Props>,
) => React.ComponentType<$Diff<Props, { toggleTodo: ToggleTodo }>>;
export const withToggleTodo: WithToggleTodo<*> = graphql(TOGGLE_TODO_MUTATION, {
  alias: 'withToggleTodo',
  props: ({ mutate }) => ({
    toggleTodo: ({ id, completed }) =>
      mutate({
        variables: { id, completed },
        optimisticResponse: {
          __typename: 'Mutation',
          updateTodo: {
            __typename: 'Todo',
            id,
            completed,
          },
        },
      }),
  }),
});

/**
 * Toggle HOC
 */
export type ToggleAll = (completed: boolean) => void;
export type WithToggleAll<Props: {}> = (
  Component: React.ComponentType<Props>,
) => React.ComponentType<$Diff<Props, { toggleAll: ToggleAll }>>;
export const withToggleAll: WithToggleAll<*> = graphql(TOGGLE_ALL_MUTATION, {
  alias: 'withToggleAll',
  props: ({ mutate }) => ({
    toggleAll: completed =>
      mutate({
        variables: { completed },
        optimisticResponse: {
          __typename: 'Mutation',
          toggleAll: {
            __typename: 'Todo',
            completed,
          },
        },
        update: (proxy, { data: { toggleAll } }) => {
          const prevState = proxy.readQuery({ query: TODOS_QUERY });
          const setItem = R.set(R.lensProp('completed'), toggleAll.completed);
          const data = R.evolve({ todos: R.map(setItem) })(prevState);
          proxy.writeQuery({ query: TODOS_QUERY, data });
        },
      }),
  }),
});

/**
 * Delete HOC
 */
export type DeleteTodos = (todos: Array<Todo>) => void;
export type WithDeleteTodos<Props: {}> = (
  Component: React.ComponentType<Props>,
) => React.ComponentType<$Diff<Props, { deleteTodo: DeleteTodos }>>;
export const withDeleteTodos: WithDeleteTodos<*> = graphql(
  DELETE_TODOS_MUTATION,
  {
    alias: 'withDeleteTodos',
    props: ({ mutate }) => ({
      deleteTodos: todos => {
        const ids = R.pluck('id')(todos);

        return mutate({
          variables: { ids },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteTodos: ids,
          },
          update: (proxy, { data: { deleteTodos } }) => {
            const prevState = proxy.readQuery({ query: TODOS_QUERY });
            const lens = R.lensProp('todos');
            const filter = R.filter(todo => !deleteTodos.includes(todo.id));
            const data = R.over(lens, filter)(prevState);
            proxy.writeQuery({ query: TODOS_QUERY, data });
          },
        });
      },
    }),
  },
);
