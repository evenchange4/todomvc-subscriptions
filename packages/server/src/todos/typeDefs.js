import ACTIONS from '@todomvc-subscriptions/constants/actions';

const ENUM = `
  # Subscription action type
  enum ActionType {
    ${ACTIONS.CREATE}
    ${ACTIONS.UPDATE}
    ${ACTIONS.DELETE}
    ${ACTIONS.TOGGLE_ALL}
  }
`;

const QUERY = `
  type Todo {
    id: ID!
    title: String
    completed: Boolean
  }

  type Query {
    todos: [Todo]!
  }
`;

const MUTATION = `
  input UpdateTodoPayload {
    id: ID!
    title: String
    completed: Boolean
  }
  type toggleAllResponse {
    completed: Boolean!
  }
  type Mutation {
    createTodo(title: String!): Todo!
    updateTodo(payload: UpdateTodoPayload!): Todo!
    toggleAll(completed: Boolean!): toggleAllResponse!
    deleteTodos(ids: [ID]!): [ID]!
  }
`;

const SUBSCRIPTION = `
  type SubscriptionResponse {
    payload: [Todo]
    type: ActionType!
  }

  type Subscription {
    # Subscription fires on todo changed
    todoChanged(filter: String): SubscriptionResponse!
  }
`;

export default [ENUM, QUERY, MUTATION, SUBSCRIPTION];
