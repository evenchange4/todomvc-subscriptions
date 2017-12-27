import * as React from 'react';
import * as R from 'ramda';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import { withTodos } from '../hoc';
import mockClient from '../../../lib/mockClient';

it('should pass props into component', () => {
  const Component = () => null;
  const Container = withTodos(Component);
  const wrapper = mount(
    <MockedProvider>
      <Container />
    </MockedProvider>,
  );

  expect(toJson(wrapper.find(Component))).toMatchSnapshot();
});

it('should get todos', () => {
  const mockData = [
    {
      id: '5',
      completed: false,
      title: 'micro-proxy',
      __typename: 'Todo',
    },
    {
      id: '4',
      completed: true,
      title: 'Docker and pkg',
      __typename: 'Todo',
    },
  ];
  const client = mockClient({
    typeDefs: `
      type Todo {
        id: ID!
        title: String
        completed: Boolean
      }
      type Query {
        todos: [Todo]
      }
    `,
    mocks: {
      Query: () => ({
        todos: () => mockData,
      }),
    },
  });

  class Component extends React.Component<{ todos: any }> {
    componentWillReceiveProps(props) {
      expect(
        props.todos.todos.map(
          R.pick(['id', 'completed', 'title', '__typename']),
        ),
      ).toEqual(mockData);
    }
    render() {
      return null;
    }
  }
  const Container = withTodos(Component);

  mount(
    <MockedProvider client={client}>
      <Container />
    </MockedProvider>,
  );
});
