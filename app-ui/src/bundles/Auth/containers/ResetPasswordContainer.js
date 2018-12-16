import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import lifecycle from 'components/Lifecycle';
import { modelPath, resetPassword, validatePasswordToken } from 'bundles/Auth/modules/ResetPasswordModule';
import ResetPassword from 'bundles/Auth/components/ResetPassword';
import config from 'config/index';
import { history } from 'modules/LocationModule';
import { getResetPasswordForm, getResetToken } from 'bundles/Auth/selectors/AuthSelectors';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state    The application state.
 * @param {Object} ownProps The props passed to the component.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = (state, ownProps) => ({
  token: getResetToken(ownProps),
  form: getResetPasswordForm(state),
});

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @param {Object} ownProps   The props passed to the component.
 * @returns {Object} The props passed to the react component.
 */
export const mapDispatchToProps = (dispatch, ownProps) => ({
  onResetFailure: () => history.push(config.route.auth.passwordRecovery),
  onReset: (token, data) => dispatch(resetPassword({ token, data })),
  componentWillMount: () => dispatch(validatePasswordToken(getResetToken(ownProps))),
  componentWillUnmount: () => dispatch(actions.reset(modelPath)),
});

export default connect(mapStateToProps, mapDispatchToProps)(lifecycle(ResetPassword));
