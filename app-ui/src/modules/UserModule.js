import { createAction, handleActions } from 'redux-actions';
import { userState } from 'modules/StateModule';

export const initialState = {
  initialized: false,
  data: {},
};

export const initUser = createAction('INIT_USER');
export const fetchUser = createAction('FETCH_USER');
export const saveUser = createAction('SAVE_USER');
export const deleteUser = createAction('DELETE_USER');
export const signOutUser = createAction('SIGN_OUT_USER');
export const resetUserState = createAction('RESET_USER_STATE', () => userState);

export default handleActions({
  [initUser]: state => ({ ...state, initialized: true }),
  [saveUser]: (state, action) => ({ ...state, data: action.payload }),
  [deleteUser]: state => ({ ...state, data: initialState.data }),
}, initialState);
