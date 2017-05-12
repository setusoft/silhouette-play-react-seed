import { connect } from 'react-redux';
import { resetPassword } from 'routes/Auth/modules/ResetPasswordModule';
import ResetPassword from 'routes/Auth/components/ResetPassword';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state    The application state.
 * @param {Object} ownProps The props passed to the component.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = (state, ownProps) => ({
  token: ownProps.params.token,
  ...state.auth.resetPassword.form,
  ...state.auth.resetPassword.request,
});

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
const mapDispatchToProps = dispatch => ({
  onReset: (token, data) => dispatch(resetPassword({ token, data })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
