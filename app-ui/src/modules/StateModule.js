import omit from 'lodash/omit';
import { createAction, handleActions } from 'redux-actions';

// The state keys were user related data will be stored. This can be used on logout to reset the state.
export const userState = ['user'];

export const resetState = createAction('RESET_STATE');

export default handleActions({
  [resetState]: (state, action) => omit(state, action.payload || []),
}, {});
