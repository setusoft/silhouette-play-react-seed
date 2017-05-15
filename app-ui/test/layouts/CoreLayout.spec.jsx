import React from 'react';
import Alert from 'react-s-alert';
import { shallow } from 'enzyme';
import { Nav } from 'react-bootstrap';
import CoreLayout from 'layouts/CoreLayout';
import HeaderContainer from 'containers/HeaderContainer';

describe('(Layout) CoreLayout', () => {
  let wrapper;
  let headerNav;
  let child;

  beforeEach(() => {
    headerNav = (<Nav />);
    child = <h1 className="child">Child</h1>;
    wrapper = shallow(<CoreLayout headerNav={headerNav}>{child}</CoreLayout>);
  });

  it('Should contain the `HeaderContainer`', () => {
    expect(wrapper.contains(
      <HeaderContainer>{headerNav}</HeaderContainer>,
    )).to.be.true();
  });

  it('Should contain the `Alert`', () => {
    expect(wrapper.contains(
      <Alert
        stack={{ limit: 3 }}
        html
        effect="stackslide"
        position="bottom-right"
        beep={false}
        timeout={10000}
      />,
    )).to.be.true();
  });

  it('Should render the children', () => {
    expect(wrapper.find('.child')).to.have.length(1);
  });
});
