/* eslint jsx-a11y/no-autofocus: 0 */
// @flow
import * as React from 'react';
import c from 'classnames';

type Props = {
  onSave: (value: string) => void,
  isEditing?: boolean,
  isNewTodo?: boolean,
  defaultValue?: string,
  placeholder?: string,
};
type State = {
  value: string,
};

class TodoTextInput extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { value: props.defaultValue || '' };
  }
  onKeyDown = (e: SyntheticEvent<HTMLInputElement>) => {
    const { onSave, isNewTodo } = this.props;
    if (e.which === 13) {
      onSave(e.currentTarget.value.trim());
      if (isNewTodo) this.setState({ value: '' });
    }
  };
  onChange = (e: SyntheticEvent<HTMLInputElement>) =>
    this.setState({ value: e.currentTarget.value });
  onBlur = (e: SyntheticEvent<HTMLInputElement>) => {
    const { isNewTodo, onSave } = this.props;
    if (!isNewTodo) onSave(e.currentTarget.value);
  };

  render() {
    const { isEditing, isNewTodo, placeholder } = this.props;
    const { value } = this.state;
    const { onBlur, onChange, onKeyDown } = this;

    return (
      <input
        className={c({
          [`edit`]: isEditing,
          [`new-todo`]: isNewTodo,
        })}
        type="text"
        placeholder={placeholder}
        autoFocus
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    );
  }
}

export default TodoTextInput;
