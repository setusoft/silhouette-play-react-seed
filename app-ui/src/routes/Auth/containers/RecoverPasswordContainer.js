import { connect } from 'react-redux';
import { recoverPassword } from 'routes/Auth/modules/RecoverPasswordModule';
import RecoverPassword from 'routes/Auth/components/RecoverPassword';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => ({
  ...state.auth.recoverPassword.form,
  ...state.auth.recoverPassword.request,
});

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
const mapDispatchToProps = dispatch => ({
  onSend: data => dispatch(recoverPassword(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecoverPassword);
