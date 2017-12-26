/* eslint jsx-a11y/label-has-for: 0 */
// @flow
import React, { Component } from 'react';
import c from 'classnames';
import { compose } from 'react-apollo';
import TodoTextInput from './TodoTextInput';
import {
  withEditTodo,
  withToggleTodo,
  withDeleteTodos,
  type Todo,
  type EditTodo,
  type ToggleTodo,
  type DeleteTodos,
} from '../modules/todos/hoc';

type Props = {
  todo: Todo,
  editTodo: EditTodo,
  toggleTodo: ToggleTodo,
  deleteTodos: DeleteTodos,
};
type State = {
  isEditing: boolean,
};

class TodoItem extends Component<Props, State> {
  state = { isEditing: false };
  onDoubleClick = () => this.setState({ isEditing: true });
  onSave = value => {
    const { todo, editTodo, deleteTodos } = this.props;
    if (value.length === 0) {
      deleteTodos([todo]);
    } else {
      editTodo({ id: todo.id, title: value });
    }
    this.setState({ isEditing: false });
  };
  onToggle = () => {
    const { todo: { id, completed }, toggleTodo } = this.props;
    toggleTodo({ id, completed: !completed });
  };
  onDeleteClick = () => {
    const { todo, deleteTodos } = this.props;
    deleteTodos([todo]);
  };
  render() {
    const { todo: { completed, title } } = this.props;
    const { isEditing } = this.state;
    const { onToggle, onDeleteClick, onDoubleClick, onSave } = this;

    return (
      <li
        className={c({
          [`completed`]: completed,
          [`editing`]: isEditing,
        })}
      >
        {isEditing ? (
          <TodoTextInput
            defaultValue={title}
            isEditing={isEditing}
            onSave={onSave}
          />
        ) : (
          <div className="view">
            <input
              className="toggle"
              type="checkbox"
              checked={completed}
              onChange={onToggle}
            />
            <label onDoubleClick={onDoubleClick}>{title}</label>
            <button className="destroy" onClick={onDeleteClick} />
          </div>
        )}
      </li>
    );
  }
}

export default compose(withEditTodo, withToggleTodo, withDeleteTodos)(TodoItem);
