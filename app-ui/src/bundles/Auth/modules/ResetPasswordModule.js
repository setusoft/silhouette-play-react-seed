// @flow
import { combineReducers } from 'redux';
import { createAction, handleActions } from 'redux-actions';
import { formReducer, modelReducer } from 'react-redux-form';
import { createRequestState } from 'questrar/redux';

export const resetPasswordRequest = createRequestState('AUTH_RESET_PASSWORD');


export type ResetPasswordForm = {
  password: string,
}

export const modelPath: string = 'auth.resetPassword.data';
export const formState: ResetPasswordForm = {
  password: '',
};

export const resetPassword = createAction('AUTH_RESET_PASSWORD');

export const validatePasswordToken = createAction('AUTH_VALIDATE_PASSWORD_TOKEN');

export default combineReducers({
  form: formReducer(modelPath, formState),
  data: modelReducer(modelPath, formState),
});
