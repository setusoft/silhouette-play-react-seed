import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import lifecycle from 'components/Lifecycle';
import { modelPath, signUp } from 'bundles/Auth/modules/SignUpModule';
import SignUp from 'bundles/Auth/components/SignUp';
import { initialRequest } from "modules/RequestStateModule";
import get from 'lodash/get';


/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => ({
  form: state.auth.signUp.form,
  request: get(state.request, signUp().type, initialRequest),
});

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
const mapDispatchToProps = dispatch => ({
  onSignUp: data => dispatch(signUp(data)),
  componentWillUnmount: () => dispatch(actions.reset(modelPath)),
});

export default connect(mapStateToProps, mapDispatchToProps)(lifecycle(SignUp));
