import _ from 'lodash';
import { createAction, handleActions } from 'redux-actions';

export const resetState = createAction('RESET_STATE');

export default handleActions({
  [resetState]: (state, action) => _.omit(state, action.payload || []),
}, {});
