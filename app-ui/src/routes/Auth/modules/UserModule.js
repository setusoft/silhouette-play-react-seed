import { createAction, handleActions } from 'redux-actions';

export const initialState = {
  initialized: false,
  data: {},
};

export const userState = [
  // Add here the state keys you would like to reset
];

export const initUser = createAction('AUTH_INIT_USER');
export const fetchUser = createAction('AUTH_FETCH_USER');
export const saveUser = createAction('AUTH_SAVE_USER');
export const deleteUser = createAction('AUTH_DELETE_USER');
export const resetUserState = createAction('AUTH_RESET_USER_STATE', () => userState);

export default handleActions({
  [initUser]: (state, action) => ({ ...state, data: action.payload || initialState.data, initialized: true }),
  [saveUser]: (state, action) => ({ ...state, data: action.payload }),
  [deleteUser]: state => ({ ...state, data: initialState.data }),
}, initialState);
