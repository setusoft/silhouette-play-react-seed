// @flow
import includes from 'lodash/includes';

export const isI18nInitialized = (state: Object) => state.init.i18n;
export const isHealthInitialized = (state: Object) => state.init.health;
export const isUserInitialized = (state: Object) => state.init.user;
export const isInitialized = (state: Object) => !includes(state.init, false);
