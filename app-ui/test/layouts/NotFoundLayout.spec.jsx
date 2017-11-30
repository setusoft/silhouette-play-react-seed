import React from 'react';
import { shallow } from 'enzyme';
import { Trans } from 'lingui-react';
import { Link } from 'react-router';
import CoreLayout from 'layouts/CoreLayout';
import NotFoundLayout from 'layouts/NotFoundLayout';
import config from 'config/index';

describe('(Layout) NotFoundLayout', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<NotFoundLayout />);
  });

  it('Should extend the `CoreLayout`', () => {
    expect(wrapper.find(CoreLayout)).to.have.length(1);
  });

  it('Should contain the 404 status code', () => {
    expect(wrapper.contains(<p className="code">404</p>)).to.be.true();
  });

  it('Should contain an error description', () => {
    expect(wrapper.contains(<p><Trans>The Page you are looking for could not be found!</Trans></p>)).to.be.true();
  });

  it('Should contain the link to the home page', () => {
    expect(wrapper.contains(<p><Link to={config.route.index}><Trans>Back to Home</Trans></Link></p>)).to.be.true();
  });
});
