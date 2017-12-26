/* eslint jsx-a11y/click-events-have-key-events: 0, jsx-a11y/anchor-is-valid: 0, jsx-a11y/no-static-element-interactions: 0 */
// @flow
import * as React from 'react';
import c from 'classnames';
import { compose } from 'react-apollo';
import {
  withDeleteTodos,
  type DeleteTodos,
  type Todo,
} from '../modules/todos/hoc';
import { withUpdateFilter, type UpdateFilter } from '../modules/filter/hoc';
import {
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_ACTIVE,
  type Filter,
} from '../modules/filter/constants';

type Props = {|
  todoLength: number,
  completedTodos: Array<Todo>,
  filter: Filter,
  updateFilter: UpdateFilter,
  deleteTodos: DeleteTodos,
|};

const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_ACTIVE]: 'Active',
  [SHOW_COMPLETED]: 'Completed',
};

const Footer = ({
  filter,
  todoLength,
  completedTodos,
  updateFilter,
  deleteTodos,
}: Props) => (
  <footer className="footer">
    <span className="todo-count">
      <strong>{todoLength - completedTodos.length || 'No'}</strong>&nbsp;
      {todoLength - completedTodos.length === 1 ? 'item' : 'items'} left
    </span>

    <ul className="filters">
      {[SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED].map(e => (
        <li key={e}>
          <a
            className={c({ [`selected`]: e === filter })}
            style={{ cursor: 'pointer' }}
            onClick={() => updateFilter(e)}
          >
            {FILTER_TITLES[e]}
          </a>
        </li>
      ))}
    </ul>

    {completedTodos.length > 0 && (
      <button
        className="clear-completed"
        onClick={() => deleteTodos(completedTodos)}
      >
        Clear completed
      </button>
    )}
  </footer>
);

export default compose(withUpdateFilter, withDeleteTodos)(Footer);
