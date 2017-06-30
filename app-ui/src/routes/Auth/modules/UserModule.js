import { createAction, handleActions } from 'redux-actions';

export const initialState = {
  initialized: false,
  data: {},
};

export const initializeUser = createAction('AUTH_INITIALIZE_USER');

export const fetchUser = createAction('AUTH_FETCH_USER');
export const saveUser = createAction('AUTH_SAVE_USER');
export const deleteUser = createAction('AUTH_DELETE_USER');

export default handleActions({
  [initializeUser]: state => ({ ...state, initialized: true }),
  [saveUser]: (state, action) => ({ ...state, data: action.payload }),
  [deleteUser]: state => ({ ...state, data: initialState.data }),
}, initialState);
