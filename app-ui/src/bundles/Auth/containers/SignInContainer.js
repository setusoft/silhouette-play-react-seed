import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import lifecycle from 'components/Lifecycle';
import { modelPath, signIn } from 'bundles/Auth/modules/SignInModule';
import SignIn from 'bundles/Auth/components/SignIn';
import { getSignInForm } from 'bundles/Auth/selectors/AuthSelectors';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => ({
  form: getSignInForm(state),
});

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
export const mapDispatchToProps = dispatch => ({
  onSignIn: data => dispatch(signIn(data)),
  componentWillUnmount: () => dispatch(actions.reset(modelPath)),
});

export default connect(mapStateToProps, mapDispatchToProps)(lifecycle(SignIn));
