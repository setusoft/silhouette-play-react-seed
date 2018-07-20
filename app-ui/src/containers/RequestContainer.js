// @flow
import get from 'lodash/get';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { getPathname, history } from 'modules/LocationModule';
import { signOutUser } from 'modules/UserModule';
import Request from "components/Request/Request";
import {initialRequest, removeRequest} from "modules/RequestStateModule";

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @param {Object} props The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = (state, props) => ({
  request: get(state.request, props.rId, initialRequest),
});

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * onCloseError default request state reset callback
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onCloseError: (id: string) => dispatch(removeRequest(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Request);
