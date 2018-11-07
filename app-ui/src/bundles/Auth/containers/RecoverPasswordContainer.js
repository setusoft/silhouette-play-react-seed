import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import lifecycle from 'components/Lifecycle';
import { modelPath, recoverPassword } from 'bundles/Auth/modules/RecoverPasswordModule';
import RecoverPassword from 'bundles/Auth/components/RecoverPassword';
import { history } from 'modules/LocationModule';
import config from 'config/index';
import { getRecoverPasswordForm } from 'bundles/Auth/selectors/AuthSelectors';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => ({
  form: getRecoverPasswordForm(state),
});


/**
 * Attaches callback to on recover request success
 * @param r
 */
export const onRecover = (r) => {
  r.actions.remove(r.data.id);
  history.push(config.route.auth.signIn);
};

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
export const mapDispatchToProps = dispatch => ({
  onRecover,
  onSend: data => dispatch(recoverPassword(data)),
  componentWillUnmount: () => dispatch(actions.reset(modelPath)),
});

export default connect(mapStateToProps, mapDispatchToProps)(lifecycle(RecoverPassword));
