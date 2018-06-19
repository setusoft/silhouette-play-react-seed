// @flow
import { createAction, handleActions } from 'redux-actions';

export const initialState = {
  isPending: false,
  isHealthy: undefined,
};

export const fetchHealth = createAction('FETCH_HEALTH');
export const fetchHealthPending = createAction('FETCH_HEALTH_PENDING');
export const fetchHealthFulfilled = createAction('FETCH_HEALTH_FULFILLED');
export const fetchHealthRejected = createAction('FETCH_HEALTH_REJECTED');

export const changeToHealthy = createAction('CHANGE_TO_HEALTHY');
export const changeToUnhealthy = createAction('CHANGE_TO_UNHEALTHY');

export default handleActions({
  [fetchHealthPending]: state => ({ ...state, isPending: true }),
  [fetchHealthFulfilled]: state => ({ ...state, isPending: false, isHealthy: true }),
  [fetchHealthRejected]: state => ({ ...state, isPending: false, isHealthy: false }),
}, initialState);
