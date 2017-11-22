import React from 'react';
import { Provider } from 'react-redux';
import { browserHistory, Router, Link } from 'react-router';
import { shallow } from 'enzyme';
import App from 'components/App';
import I18nLoaderContainer from 'containers/I18nLoaderContainer';
import PreloaderContainer from 'containers/PreloaderContainer';
import { initialState as i18nState } from 'modules/I18nModule';
import { createStore } from '../test-helpers';

describe('(Component) App', () => {
  let routes;
  let store;
  let wrapper;

  beforeEach(() => {
    routes = <Link to="/test">test</Link>;
    store = createStore({ i18n: i18nState });
  });

  it('Should render the content', () => {
    wrapper = shallow(<App routes={routes} store={store} />);

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
});
