import omit from 'lodash/omit';
import { createAction, handleActions } from 'redux-actions';


//Generic request state.
// Any request can be tracked from this redux module to avoid complexity
// of tracking and managing module-owned request state

export type Request = {
  isPending: boolean,
  isSuccess: boolean | string,
  isFailure: boolean | string,
}

export const initialRequest: Request = {
  isPending: false,
  isSuccess: false,
  isFailure: false,
};

export type RequestState = {
  [string]: Request
};

const initialRequestState: RequestState = {};

/**
 * Sets state of request to pending
 */
const setRequestPending = (state, payload) => {

  return {...state, [payload]: { isPending: true, isFailure: false, isSuccess: false}}
};

/**
 * Sets state of request to failure
 */
const setRequestFailed = (state, payload) => {
  if(payload.constructor === Object){
    const { rId, description } = payload;
    return {...state, [rId]: { isPending: false , isFailure: description, isSuccess: false}}
  }
  return {...state, [payload]: { isPending: false , isFailure: true, isSuccess: false}}
};

/**
 * Sets state of request to success
 */
const setRequestSuccess = (state, payload) => {
  if(payload.constructor === Object){
    const { rId, description } = payload;
    return {...state, [rId]: { isPending: false , isFailure: false, isSuccess: description}}
  }
  return {...state, [payload]: { isPending: false , isFailure: false, isSuccess: true }}
};


//payload: string: rId
export const addRequest = createAction('REQUEST_STATE_ADD_REQUEST');

//payload: string: rId
export const removeRequest = createAction('REQUEST_STATE_REMOVE_REQUEST');

//payload: string: rId
export const requestPending = createAction('REQUEST_STATE_REQUEST_PENDING');

//payload: string: rId | { rId: string, description: string }
export const requestFailed = createAction('REQUEST_STATE_REQUEST_FAILED');

//payload: string: rId | { rId: string, description: string }
export const requestSuccessful = createAction('REQUEST_STATE_REQUEST_SUCCESSFUL');

/**
 * Request state default reducer
 */
export default handleActions({
  [addRequest]: (state, action) => ({ ...state, [action.payload]: initialRequest }),
  [requestPending]: (state, action) => setRequestPending(state, action.payload),
  [requestFailed]: (state, action) => setRequestFailed(state, action.payload),
  [requestSuccessful]: (state, action) => setRequestSuccess(state, action.payload),
  [removeRequest]: (state, action) => omit(state, action.payload || []),
}, initialRequestState);