import { connect } from 'react-redux';
import { initApp } from 'modules/AppModule';
import App from 'components/App';

/**
 * Maps the state properties to the React component `props`.
 *
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = () => ({});

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
const mapDispatchToProps = dispatch => ({
  onInit: () => dispatch(initApp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
