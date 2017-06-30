import { connect } from 'react-redux';
import { fetchUser } from 'routes/Auth/modules/UserModule';
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
  fetchUser: initialize => dispatch(fetchUser({ initialize })),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
