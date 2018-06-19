import { createAction, handleActions } from 'redux-actions';

export const initialState = {
  isPending: false,
  model: {},
};

export const fetchConfig = createAction('FETCH_CONFIG');
export const fetchConfigPending = createAction('FETCH_CONFIG_PENDING');
export const fetchConfigFulfilled = createAction('FETCH_CONFIG_FULFILLED');
export const fetchConfigRejected = createAction('FETCH_CONFIG_REJECTED');

export default handleActions({
  [fetchConfigPending]: state => ({ ...state, isPending: true }),
  [fetchConfigFulfilled]: (state, action) => ({ ...state, isPending: false, model: action.payload }),
  [fetchConfigRejected]: state => ({ ...state, isPending: false }),
}, initialState);
