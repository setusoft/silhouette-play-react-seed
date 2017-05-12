import { createAction, handleActions } from 'redux-actions';

export const initialState = {};

export const fetchUser = createAction('AUTH_FETCH_USER');
export const saveUser = createAction('AUTH_SAVE_USER');
export const deleteUser = createAction('AUTH_DELETE_USER');

export default handleActions({
  [saveUser]: (state, action) => action.payload,
  [deleteUser]: () => (initialState),
}, initialState);
