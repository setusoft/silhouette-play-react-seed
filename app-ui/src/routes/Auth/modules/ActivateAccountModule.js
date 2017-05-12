// @flow
import { createAction, handleActions } from 'redux-actions';

export type InitialState = {
  email: string,
  isPending: boolean
}

export const initialState: InitialState = { email: '', isPending: false };

export const saveActivationEmail = createAction('AUTH_SAVE_ACTIVATION_EMAIL');
export const sendActivationEmail = createAction('AUTH_SEND_ACTIVATION_EMAIL');
export const sendActivationEmailPending = createAction('AUTH_SEND_ACTIVATION_EMAIL_PENDING');
export const sendActivationEmailFulfilled = createAction('AUTH_SEND_ACTIVATION_EMAIL_FULFILLED');
export const sendActivationEmailRejected = createAction('AUTH_SEND_ACTIVATION_EMAIL_REJECTED');
export const activateAccount = createAction('AUTH_ACTIVATE_ACCOUNT');

export default handleActions({
  [saveActivationEmail]: (state, action) => ({ ...state, email: action.payload }),
  [sendActivationEmailPending]: state => ({ ...state, isPending: true }),
  [sendActivationEmailFulfilled]: state => ({ ...state, email: '', isPending: false }),
  [sendActivationEmailRejected]: state => ({ ...state, isPending: false }),
}, initialState);
