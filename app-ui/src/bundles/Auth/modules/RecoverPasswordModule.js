// @flow
import { combineReducers } from 'redux';
import { createAction, handleActions } from 'redux-actions';
import { formReducer, modelReducer } from 'react-redux-form';

export type RequestState = {
  isPending: boolean
}

export type RecoverPasswordForm = {
  email: string,
}

export const modelPath: string = 'auth.recoverPassword.data';
export const requestState: RequestState = { isPending: false };
export const formState: RecoverPasswordForm = {
  email: '',
};

export const recoverPassword = createAction('AUTH_RECOVER_PASSWORD');
export const recoverPasswordPending = createAction('AUTH_RECOVER_PASSWORD_PENDING');
export const recoverPasswordFulfilled = createAction('AUTH_RECOVER_PASSWORD_FULFILLED');
export const recoverPasswordRejected = createAction('AUTH_RECOVER_PASSWORD_REJECTED');

export default combineReducers({
  request: handleActions({
    [recoverPasswordPending]: () => ({ isPending: true }),
    [recoverPasswordFulfilled]: () => ({ isPending: false }),
    [recoverPasswordRejected]: () => ({ isPending: false }),
  }, requestState),
  form: formReducer(modelPath, formState),
  data: modelReducer(modelPath, formState),
});
