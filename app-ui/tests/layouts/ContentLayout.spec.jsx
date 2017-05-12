import React from 'react';
import { shallow } from 'enzyme';
import { Nav } from 'react-bootstrap';
import CoreLayout from 'layouts/CoreLayout';
import ContentLayout from 'layouts/ContentLayout';

describe('(Layout) ContentLayout', () => {
  let wrapper;
  let headerNav;
  let child;

  beforeEach(() => {
    headerNav = (<Nav />);
    child = <h1 className="child">Child</h1>;
    wrapper = shallow(<ContentLayout headerNav={headerNav}>{child}</ContentLayout>);
  });

  it('Should extend the `CoreLayout`', () => {
    expect(wrapper.find(CoreLayout)).to.have.length(1);
  });

  it('Should render the children', () => {
    expect(wrapper.find('.child')).to.have.length(1);
  });
});
