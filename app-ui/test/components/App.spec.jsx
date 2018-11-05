import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { Provider as RequestStateProvider } from 'questrar';
import {
  Switch, Router, Route, Redirect,
} from 'react-router-dom';
import { initialState as i18nState } from 'modules/I18nModule';
import App from 'components/App';
import I18nLoaderContainer from 'containers/I18nLoaderContainer';
import PreloaderContainer from 'containers/PreloaderContainer';
import MaintenanceContainer from 'containers/MaintenanceContainer';
import { CaptureNotFoundRoute, NotFoundRoute } from 'components/NotFound';

import { createStore } from '../test-helpers';

describe('(Component) App', () => {
  let store;
  let wrapper;

  beforeEach(() => {
    store = createStore({ i18n: i18nState });
    wrapper = shallow(<App store={store} />);
  });

  it('Should contain the `Provider` as root element', () => {
    expect(wrapper.first().is(Provider)).to.be.true();
  });

  it('Should contain the `RequestStateProvider` component as child of the `Provider` component', () => {
    expect(wrapper.find(Provider).children().first().is(RequestStateProvider)).to.be.true();
  });

  it('Should contain the `I18nLoaderContainer` component as child of the `Provider` component', () => {
    expect(wrapper.find(RequestStateProvider).children().first().is(I18nLoaderContainer)).to.be.true();
  });

  it('Should contain the `PreloaderContainer` component as child of the `I18nLoaderContainer` component', () => {
    expect(wrapper.find(I18nLoaderContainer).children().first().is(PreloaderContainer)).to.be.true();
  });

  it('Should contain the `MaintenanceContainer` component as child of the `PreloaderContainer` component', () => {
    expect(wrapper.find(PreloaderContainer).children().first().is(MaintenanceContainer)).to.be.true();
  });

  it('Should contain the `Router` component as child of the `MaintenanceContainer` component', () => {
    expect(wrapper.find(MaintenanceContainer).children().first().is(Router)).to.be.true();
  });

  it('Should contain the `CaptureNotFoundRoute` component as child of the `Router` component', () => {
    expect(wrapper.find(Router).children().first().is(CaptureNotFoundRoute)).to.be.true();
  });

  it('Should contain the `Switch` component as child of the `CaptureNotFoundRoute` component', () => {
    expect(wrapper.find(CaptureNotFoundRoute).children().first().is(Switch)).to.be.true();
  });

  describe('(Component) Switch', () => {
    it('Should contain a redirect from / to /admin as first', () => {
      expect(wrapper.find(Switch).children().at(0).contains(<Redirect exact from="/" to="/admin" />)).to.be.true();
    });

    it('Should contain the /admin route as second', () => {
      expect(wrapper.find(Switch).children().at(1).is(Route)).to.be.true();
      expect(wrapper.find(Switch).children().at(1).props().path).to.equal('/admin');
    });

    it('Should contain the /auth route as third', () => {
      expect(wrapper.find(Switch).children().at(2).is(Route)).to.be.true();
      expect(wrapper.find(Switch).children().at(2).props().path).to.equal('/auth');
    });

    it('Should contain the not found route as last', () => {
      expect(wrapper.find(Switch).children().last().is(NotFoundRoute)).to.be.true();
    });
  });
});
