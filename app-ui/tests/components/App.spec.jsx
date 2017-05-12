import React from 'react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { browserHistory, Router, Link } from 'react-router';
import { shallow, mount } from 'enzyme';
import App from 'components/App';
import { createStore } from '../test-helpers';

describe('(Component) App', () => {
  let routes;
  let store;
  let wrapper;
  let fetchUser;

  beforeEach(() => {
    routes = <Link to="/test">test</Link>;
    store = createStore({});
    fetchUser = sinon.spy();
  });

  it('Should render the provider and router', () => {
    wrapper = shallow(<App routes={routes} store={store} fetchUser={fetchUser} />);

    expect(wrapper.contains(
      <Provider store={store}>
        <Router history={browserHistory}>{routes}</Router>
      </Provider>
    )).to.be.true();
  });

  it('Should fetch the user on mount', () => {
    wrapper = mount(<App routes={routes} store={store} fetchUser={fetchUser} />);

    fetchUser.should.have.been.calledOnce();
  });
});
