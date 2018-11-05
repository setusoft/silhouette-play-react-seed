// @flow
import { combineReducers } from 'redux';
import { createAction, handleActions } from 'redux-actions';
import { formReducer, modelReducer } from 'react-redux-form';
import { createRequestState } from 'questrar/redux';

export const signInRequest = createRequestState('AUTH_SIGN_IN');

export type SignInForm = {
  email: string,
  password: string,
  rememberMe: boolean,
}

export const modelPath: string = 'auth.signIn.data';
export const formState: SignInForm = {
  email: '',
  password: '',
  rememberMe: false,
};

export const signIn = createAction('AUTH_SIGN_IN');

export default combineReducers({
  form: formReducer(modelPath, formState),
  data: modelReducer(modelPath, formState),
});
