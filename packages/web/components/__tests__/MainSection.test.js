/* global window */

import * as React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MainSection } from '../MainSection';

it('should shallow render <MainSection /> correctly', () => {
  window.localStorage = {
    getItem: jest.fn(),
  };
  const wrapper = shallow(
    <MainSection
      todos={{ todos: [] }}
      toggleAll={() => {}}
      subscribeTodoChanged={() => {}}
      filter={{ filter: 'SHOW_ALL' }}
    />,
  );

  expect(toJson(wrapper)).toMatchSnapshot();
  expect(window.localStorage.getItem).toMatchSnapshot();
});
