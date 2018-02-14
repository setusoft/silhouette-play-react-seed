import get from 'lodash/get';
import { connect } from 'react-redux';
import { signOutUser } from 'modules/UserModule';
import Authenticated from 'components/Header/Authenticated';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => ({
  user: get(state, 'auth.user.model', {}),
});

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
const mapDispatchToProps = dispatch => ({
  onSignOut: () => dispatch(signOutUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Authenticated);
