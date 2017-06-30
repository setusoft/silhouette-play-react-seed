import React from 'react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { browserHistory, Router, Link } from 'react-router';
import { shallow, mount } from 'enzyme';
import App from 'components/App';
import I18nLoaderContainer from 'containers/I18nLoaderContainer';
import PreloaderContainer from 'containers/PreloaderContainer';
import { initialState as i18nState } from 'modules/I18nModule';
import { createStore } from '../test-helpers';

describe('(Component) App', () => {
  let routes;
  let store;
  let wrapper;
  let fetchUser;

  beforeEach(() => {
    routes = <Link to="/test">test</Link>;
    store = createStore({ i18n: i18nState });
    fetchUser = sinon.spy();
  });

  it('Should render the content', () => {
    wrapper = shallow(<App routes={routes} store={store} fetchUser={fetchUser} />);

    expect(wrapper.contains(
      <Provider store={store}>
        <I18nLoaderContainer>
          <PreloaderContainer>
            <Router history={browserHistory}>{routes}</Router>
          </PreloaderContainer>
        </I18nLoaderContainer>
      </Provider>,
    )).to.be.true();
  });

  it('Should fetch the user on mount', () => {
    wrapper = mount(<App routes={routes} store={store} fetchUser={fetchUser} />);

    fetchUser.should.have.been.calledOnce();
  });
});
