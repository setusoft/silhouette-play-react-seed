import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';

/**
 * App component.
 */
class App extends Component {

  /**
   * Defines the props for this component.
   */
  static propTypes = {
    routes: PropTypes.shape().isRequired,
    store: PropTypes.shape().isRequired,
    fetchUser: PropTypes.func.isRequired,
  };

  /**
   * Handler which gets called after the component was applied to the DOM.
   */
  componentDidMount() {
    this.props.fetchUser();
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
        <Router history={browserHistory}>{routes}</Router>
      </Provider>
    );
  }
}

export default App;
