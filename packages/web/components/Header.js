// @flow
import React, { Component } from 'react';
import TodoTextInput from './TodoTextInput';
import { withCreateTodo, type CreateTodo } from '../modules/todos/hoc';

type Props = {
  createTodo: CreateTodo,
};

class Header extends Component<Props> {
  onSave = value => {
    if (value.length !== 0) this.props.createTodo({ title: value });
  };

  render() {
    const { onSave } = this;

    return (
      <header className="header">
        <h1>todos</h1>
        <TodoTextInput
          isNewTodo
          onSave={onSave}
          placeholder="What needs to be done?"
        />
      </header>
    );
  }
}

export default withCreateTodo(Header);
