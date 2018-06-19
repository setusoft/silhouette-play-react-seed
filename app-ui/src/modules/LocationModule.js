import createHistory from 'history/createBrowserHistory';
import { createAction, handleActions } from 'redux-actions';

export const history = createHistory();
export const initialState = history.location;

export const locationChange = createAction('LOCATION_CHANGE', location => location || '/');
export const updateLocation = ({ dispatch }) => nextLocation => dispatch(locationChange(nextLocation));

export default handleActions({
  [locationChange]: (state, action) => action.payload,
}, initialState);
