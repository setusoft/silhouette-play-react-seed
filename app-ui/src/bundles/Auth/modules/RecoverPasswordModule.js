// @flow
import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';
import { formReducer, modelReducer } from 'react-redux-form';
import { createRequestState } from 'questrar/redux';

export type RecoverPasswordForm = {
  email: string,
}

export const modelPath: string = 'auth.recoverPassword.data';
export const formState: RecoverPasswordForm = {
  email: '',
};

export const recoverPassword = createAction('AUTH_RECOVER_PASSWORD');
export const recoverPasswordRequest = createRequestState('AUTH_RECOVER_PASSWORD');


export default combineReducers({
  form: formReducer(modelPath, formState),
  data: modelReducer(modelPath, formState),
});
