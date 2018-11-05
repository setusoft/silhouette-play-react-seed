import { connect } from 'react-redux';
import lifecycle from 'components/Lifecycle';
import { history } from 'modules/LocationModule';
import { sendActivationEmail } from 'bundles/Auth/modules/ActivateAccountModule';
import ActivateAccount from 'bundles/Auth/components/ActivateAccount';
import config from 'config/index';
import { activateAccount } from "bundles/Auth/selectors/AuthSelectors";

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => activateAccount(state);

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
const mapDispatchToProps = dispatch => ({
  onActivationSent: (r) => {
    r.actions.remove(r.data.id);
    history.push(config.route.auth.signIn);
  },
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
