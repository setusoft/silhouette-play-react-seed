// @flow
import React from 'react';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';
import I18nLoaderContainer from 'containers/I18nLoaderContainer';
import PreloaderContainer from 'containers/PreloaderContainer';

type Props = {
  routes: Object,
  store: Object,
  fetchUser: (initialize: boolean) => void,
}

/**
 * App component.
 */
class App extends React.Component<Props> {

  /**
   * The component props.
   */
  props: Props;

  /**
   * Handler which gets called after the component was applied to the DOM.
   */
  componentDidMount() {
    this.props.fetchUser(true);
  }

  /**
   * Indicates if the component should be updated.
   *
   * @returns {boolean} True if the component should be updated, false otherwise.
   */
  shouldComponentUpdate() {
    return false;
  }

  /**
   * Renders the component.
   *
   * @returns {XML} The component.
   */
  render() {
    const { routes, store } = this.props;

    return (
      <Provider store={store}>
        <I18nLoaderContainer>
          <PreloaderContainer>
            <Router history={browserHistory}>{routes}</Router>
          </PreloaderContainer>
        </I18nLoaderContainer>
      </Provider>
    );
  }
}

export default App;
