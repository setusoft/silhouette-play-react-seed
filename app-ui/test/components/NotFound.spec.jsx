import React from 'react';
import { shallow, render } from 'enzyme';
import { Trans } from 'lingui-react';
import { Router, Link, Redirect } from 'react-router-dom';
import { history } from 'modules/LocationModule';
import CoreLayout from 'components/CoreLayout';
import NotFound, { NotFoundRoute, CaptureNotFoundRoute } from 'components/NotFound';
import config from 'config/index';

describe('(Component) NotFound', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<NotFound />);
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

  describe('(Component) NotFoundRoute', () => {
    it('Should return a redirect with `notFoundError` set to true in state', () => {
      expect(NotFoundRoute()).to.eql(<Redirect to={{ state: { notFoundError: true } }} />);
    });
  });

  describe('(Component) CaptureNotFoundRoute', () => {
    it('Should render the 404 page if the `notFoundError` state is set to true', () => {
      const h = {
        ...history,
        location: { state: { notFoundError: true } },
      };
      const component = (
        <Router history={h}>
          <CaptureNotFoundRoute>
            <div className="page" />
          </CaptureNotFoundRoute>
        </Router>
      );

      wrapper = render(component);

      expect(wrapper.find('.not-found-container')).to.have.length(1);
    });

    it('Should not render the 404 page if the `notFoundError` does not exists', () => {
      const component = (
        <Router history={history}>
          <CaptureNotFoundRoute>
            <Redirect exact from="/" to="/admin" />
          </CaptureNotFoundRoute>
        </Router>
      );

      wrapper = render(component);

      expect(wrapper.find('.not-found-container')).to.have.length(0);
    });
  });
});
