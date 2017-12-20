import React from 'react';
import { shallow } from 'enzyme';
import { Panel } from 'react-bootstrap';
import Dashboard from 'bundles/Admin/components/Dashboard';

describe('(Component) Admin/Dashboard', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Dashboard />);
  });

  it('Should contain a `Panel` component', () => {
    expect(wrapper.find(Panel)).to.have.length(1);
  });
});
