import { createAction, handleActions } from 'redux-actions';

export const initialState = {
  i18n: false,
  health: false,
  user: false,
};

export const initApp = createAction('INIT_APP');

export const setI18nInitialized = createAction('SET_I18N_INITIALIZED');
export const setHealthInitialized = createAction('SET_HEALTH_INITIALIZED');
export const setUserInitialized = createAction('SET_USER_INITIALIZED');

export default handleActions({
  [setI18nInitialized]: state => ({ ...state, i18n: true }),
  [setHealthInitialized]: state => ({ ...state, health: true }),
  [setUserInitialized]: state => ({ ...state, user: true }),
}, initialState);
