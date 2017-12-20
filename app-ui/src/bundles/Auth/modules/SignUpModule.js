// @flow
import { combineReducers } from 'redux';
import { createAction, handleActions } from 'redux-actions';
import { formReducer, modelReducer } from 'react-redux-form';

export type RequestState = {
  isPending: boolean
}

export type SignUpForm = {
  name: string,
  email: string,
  password: string,
}

export const modelPath: string = 'auth.signUp.data';
export const requestState: RequestState = { isPending: false };
export const formState: SignUpForm = {
  name: '',
  email: '',
  password: '',
};

export const signUp = createAction('AUTH_SIGN_UP');
export const signUpPending = createAction('AUTH_SIGN_UP_PENDING');
export const signUpFulfilled = createAction('AUTH_SIGN_UP_FULFILLED');
export const signUpRejected = createAction('AUTH_SIGN_UP_REJECTED');

export default combineReducers({
  request: handleActions({
    [signUpPending]: () => ({ isPending: true }),
    [signUpFulfilled]: () => ({ isPending: false }),
    [signUpRejected]: () => ({ isPending: false }),
  }, requestState),
  form: formReducer(modelPath, formState),
  data: modelReducer(modelPath, formState),
});
