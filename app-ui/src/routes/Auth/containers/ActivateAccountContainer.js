import { connect } from 'react-redux';
import { sendActivationEmail } from 'routes/Auth/modules/ActivateAccountModule';
import ActivateAccount from 'routes/Auth/components/ActivateAccount';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => ({
  ...state.auth.activateAccount,
});

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
const mapDispatchToProps = dispatch => ({
  onSend: email => dispatch(sendActivationEmail(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivateAccount);
