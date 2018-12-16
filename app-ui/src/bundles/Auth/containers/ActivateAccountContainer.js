import { connect } from 'react-redux';
import lifecycle from 'components/Lifecycle';
import { history } from 'modules/LocationModule';
import { sendActivationEmail } from 'bundles/Auth/modules/ActivateAccountModule';
import ActivateAccount from 'bundles/Auth/components/ActivateAccount';
import config from 'config/index';
import { getActivateAccountEmail } from 'bundles/Auth/selectors/AuthSelectors';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => getActivateAccountEmail(state);

/**
 * Account activation request on success callback
 * @param event MouseEvent
 * @param request Request state
 */
export const onActivationSent = (event, request) => {
  request.actions.remove(request.data.id);
  history.push(config.route.auth.signIn);
};

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
export const mapDispatchToProps = dispatch => ({
  onActivationSent,
  onSend: email => dispatch(sendActivationEmail(email)),
  componentWillMount: (email) => {
    if (!email) {
      history.push(config.route.auth.signIn);
    }
  },
});

/**
 * Merges the state and dispatch props.
 *
 * @param {Object} stateProps    The state props.
 * @param {Object} dispatchProps The dispatch props.
 * @param {Object} ownProps      The props passed to the container component.
 * @returns {Object} The merged props.
 */
const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  componentWillMount: () => dispatchProps.componentWillMount(stateProps.email),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(lifecycle(ActivateAccount));
