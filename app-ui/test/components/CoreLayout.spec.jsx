import React from 'react';
import Alert from 'react-s-alert';
import { Route } from 'react-router-dom';
import { shallow } from 'enzyme';
import CoreLayout from 'components/CoreLayout';
import AuthenticatedContainer from 'containers/Header/AuthenticatedContainer';
import UnauthenticatedContainer from 'containers/Header/UnauthenticatedContainer';

describe('(Component) CoreLayout', () => {
  let wrapper;
  let child;

  beforeEach(() => {
    child = <h1 className="child">Child</h1>;
    wrapper = shallow(<CoreLayout>{child}</CoreLayout>);
  });

  it('Should contain the `AuthenticatedContainer` for the /admin route', () => {
    expect(wrapper.contains(<Route path="/admin" component={AuthenticatedContainer} />)).to.be.true();
  });

  it('Should contain the `UnauthenticatedContainer` for the /auth route', () => {
    expect(wrapper.contains(<Route path="/auth" component={UnauthenticatedContainer} />)).to.be.true();
  });

  it('Should contain the `Alert`', () => {
    expect(wrapper.contains(<Alert
      stack={{ limit: 3 }}
      html
      effect="stackslide"
      position="bottom-right"
      beep={false}
      timeout={10000}
    />)).to.be.true();
  });

  it('Should render the children', () => {
    expect(wrapper.find('.child')).to.have.length(1);
  });
});
