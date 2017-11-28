import omit from 'lodash/omit';
import { createAction, handleActions } from 'redux-actions';

export const resetState = createAction('RESET_STATE');

export default handleActions({
  [resetState]: (state, action) => omit(state, action.payload || []),
}, {});
