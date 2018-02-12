import { createAction, handleActions } from 'redux-actions';
import { userState } from 'modules/StateModule';

export const initialState = {
  initialized: false,
  isPending: false,
  model: {},
};

export const fetchUser = createAction('FETCH_USER');
export const fetchUserPending = createAction('FETCH_USER_PENDING');
export const fetchUserFulfilled = createAction('FETCH_USER_FULFILLED');
export const fetchUserRejected = createAction('FETCH_USER_REJECTED');

export const signOutUser = createAction('SIGN_OUT_USER');
export const resetUserState = createAction('RESET_USER_STATE', () => userState);

export default handleActions({
  [fetchUserPending]: state => ({ ...state, isPending: true }),
  [fetchUserFulfilled]: (state, action) => ({
    ...state,
    initialized: true,
    isPending: false,
    model: action.payload,
  }),
  [fetchUserRejected]: state => ({
    ...state,
    initialized: true,
    isPending: false,
  }),
}, initialState);
