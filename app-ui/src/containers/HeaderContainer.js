import _ from 'lodash';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { signOut } from 'routes/Auth/modules/SignOutModule';
import Header from 'components/Header';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => ({
  current: _.get(state, 'location.pathname', location.pathname),
  user: _.get(state, 'auth.user', {}),
});

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
const mapDispatchToProps = dispatch => ({
  route: route => browserHistory.push(route),
  onSignOut: () => dispatch(signOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
