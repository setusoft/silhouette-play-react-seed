// @flow
import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';
import { formReducer, modelReducer } from 'react-redux-form';
import { createRequestState } from 'questrar/redux';


export type SignUpForm = {
  name: string,
  email: string,
  password: string,
}

export const modelPath: string = 'auth.signUp.data';
export const formState: SignUpForm = {
  name: '',
  email: '',
  password: '',
};

export const signUp = createAction('AUTH_SIGN_UP');
export const signUpRequest = createRequestState('AUTH_SIGN_UP');

export default combineReducers({
  form: formReducer(modelPath, formState),
  data: modelReducer(modelPath, formState),
});
