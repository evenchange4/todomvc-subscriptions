// @flow
import gql from 'graphql-tag';

export const TODOS_QUERY = gql`
  query todosQuery {
    todos {
      id
      title
      completed
    }
    filter @client
  }
`;

export const CREATE_TODO_MUTATION = gql`
  mutation createTodoMutation($title: String!) {
    createTodo(title: $title) {
      id
      title
      completed
    }
  }
`;

export const EDIT_TODO_MUTATION = gql`
  mutation editTodoMutation($id: ID!, $title: String!) {
    updateTodo(payload: { id: $id, title: $title }) {
      id
      title
    }
  }
`;

export const TOGGLE_TODO_MUTATION = gql`
  mutation toggleTodoMutation($id: ID!, $completed: Boolean!) {
    updateTodo(payload: { id: $id, completed: $completed }) {
      id
      completed
    }
  }
`;

export const TOGGLE_ALL_MUTATION = gql`
  mutation toggleAllMutation($completed: Boolean!) {
    toggleAll(completed: $completed) {
      completed
    }
  }
`;

export const DELETE_TODOS_MUTATION = gql`
  mutation deleteTodosMutation($ids: [ID]!) {
    deleteTodos(ids: $ids)
  }
`;

export const TODO_SUBSCRIPTION = gql`
  subscription todoSubscription($filter: String!) {
    todoChanged(filter: $filter) {
      type
      payload {
        id
        title
        completed
      }
    }
  }
`;
