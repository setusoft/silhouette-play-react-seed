import { connect } from 'react-redux';
import { signUp } from 'routes/Auth/modules/SignUpModule';
import SignUp from 'routes/Auth/components/SignUp';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => ({
  ...state.auth.signUp.form,
  ...state.auth.signUp.request,
});

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
const mapDispatchToProps = dispatch => ({
  onSignUp: data => dispatch(signUp(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
