import get from 'lodash/get';
import browserHistory from 'react-router/lib/browserHistory';
import { createAction, handleActions } from 'redux-actions';

export const initialState = browserHistory.getCurrentLocation();

export const getPathname = state => get(state, 'pathname', window.location.pathname);

export const locationChange = createAction('LOCATION_CHANGE', location => location || '/');
export const updateLocation = ({ dispatch }) => nextLocation => dispatch(locationChange(nextLocation));

export default handleActions({
  [locationChange]: (state, action) => action.payload,
}, initialState);
