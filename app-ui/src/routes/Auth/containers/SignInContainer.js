import { connect } from 'react-redux';
import { signIn } from 'routes/Auth/modules/SignInModule';
import SignIn from 'routes/Auth/components/SignIn';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => ({
  ...state.auth.signIn.form,
  ...state.auth.signIn.request,
});

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
const mapDispatchToProps = dispatch => ({
  onSignIn: data => dispatch(signIn(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
