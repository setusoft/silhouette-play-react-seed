import { createAction, handleActions } from 'redux-actions';
import { userState } from 'modules/StateModule';

export const initialState = {
  initialized: false,
  data: {},
};

export const initUser = createAction('AUTH_INIT_USER');
export const fetchUser = createAction('AUTH_FETCH_USER');
export const saveUser = createAction('AUTH_SAVE_USER');
export const deleteUser = createAction('AUTH_DELETE_USER');
export const resetUserState = createAction('AUTH_RESET_USER_STATE', () => userState);

export default handleActions({
  [initUser]: state => ({ ...state, initialized: true }),
  [saveUser]: (state, action) => ({ ...state, data: action.payload }),
  [deleteUser]: state => ({ ...state, data: initialState.data }),
}, initialState);
