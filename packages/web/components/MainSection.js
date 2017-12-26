/* global window */
/* eslint jsx-a11y/label-has-for: 0, jsx-a11y/click-events-have-key-events: 0, jsx-a11y/no-noninteractive-element-interactions: 0 */
// @flow
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import TodoItem from './TodoItem';
import Footer from './Footer';
import {
  withTodos,
  withToggleAll,
  type Todos,
  type ToggleAll,
  type SubscribeTodoChanged,
} from '../modules/todos/hoc';
import { withFilter } from '../modules/filter/hoc';
import {
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_ACTIVE,
  type Filter,
} from '../modules/filter/constants';

type Props = {|
  todos: Todos,
  toggleAll: ToggleAll,
  subscribeTodoChanged: SubscribeTodoChanged,
  filter: {
    filter: Filter,
  },
|};

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: todo => !todo.completed,
  [SHOW_COMPLETED]: todo => todo.completed,
};

export class MainSection extends Component<Props> {
  componentDidMount() {
    const clientID = window.localStorage.getItem('apollo-client-id');
    this.props.subscribeTodoChanged(clientID);
  }

  render() {
    const { todos: { todos = [] }, toggleAll, filter: { filter } } = this.props;
    const completedTodos = todos.filter(TODO_FILTERS[SHOW_COMPLETED]);
    const completedCount = completedTodos.length;
    const todoLength = todos.length;
    const isAllCompleted = completedCount === todoLength;

    return (
      <section className="main">
        <span>
          <input
            className="toggle-all"
            type="checkbox"
            checked={isAllCompleted}
          />
          <label onClick={() => toggleAll(!isAllCompleted)} />
        </span>
        <ul className="todo-list">
          {todos
            .filter(TODO_FILTERS[filter])
            .map(todo => <TodoItem key={todo.id} todo={todo} />)}
        </ul>
        <Footer
          filter={filter}
          todoLength={todoLength}
          completedTodos={completedTodos}
        />
      </section>
    );
  }
}

export default compose(withTodos, withFilter, withToggleAll)(MainSection);
