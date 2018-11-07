// @flow
import { createAction, handleActions } from 'redux-actions';
import { createRequestState } from 'questrar/redux';

export type InitialState = {
  email: string,
}

export const initialState: InitialState = { email: '' };

export const emailActivationRequest = createRequestState('AUTH_ACTIVATION_EMAIL');

export const sendActivationEmail = createAction('AUTH_SEND_ACTIVATION_EMAIL');
export const activateAccount = createAction('AUTH_ACTIVATE_ACCOUNT');

export const saveActivationEmail = createAction('AUTH_SAVE_ACTIVATION_EMAIL');
export const resetActivationEmail = createAction('AUTH_RESET_ACTIVATION_EMAIL');

export default handleActions({
  [saveActivationEmail]: (state, action) => ({ ...state, email: action.payload }),
  [resetActivationEmail]: state => ({ ...state, email: '' }),
}, initialState);
