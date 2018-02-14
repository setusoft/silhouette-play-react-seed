import { createAction, handleActions } from 'redux-actions';

export const initialState = {
  i18n: false,
  user: false,
};

export const initApp = createAction('INIT_APP');

export const setInitialized = createAction('SET_INITIALIZED');

export default handleActions({
  [setInitialized]: (state, action) => ({ ...state, [action.payload]: true }),
}, initialState);
