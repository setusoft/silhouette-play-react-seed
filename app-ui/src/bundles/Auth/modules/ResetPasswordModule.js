// @flow
import { combineReducers } from 'redux';
import { createAction, handleActions } from 'redux-actions';
import { formReducer, modelReducer } from 'react-redux-form';

export type RequestState = {
  isPending: boolean
}

export type ResetPasswordForm = {
  password: string,
}

export const modelPath: string = 'auth.resetPassword.data';
export const requestState: RequestState = { isPending: false };
export const formState: ResetPasswordForm = {
  password: '',
};

export const resetPassword = createAction('AUTH_RESET_PASSWORD');
export const resetPasswordPending = createAction('AUTH_RESET_PASSWORD_PENDING');
export const resetPasswordFulfilled = createAction('AUTH_RESET_PASSWORD_FULFILLED');
export const resetPasswordRejected = createAction('AUTH_RESET_PASSWORD_REJECTED');

export const validatePasswordToken = createAction('AUTH_VALIDATE_PASSWORD_TOKEN');

export default combineReducers({
  request: handleActions({
    [resetPasswordPending]: () => ({ isPending: true }),
    [resetPasswordFulfilled]: () => ({ isPending: false }),
    [resetPasswordRejected]: () => ({ isPending: false }),
  }, requestState),
  form: formReducer(modelPath, formState),
  data: modelReducer(modelPath, formState),
});
