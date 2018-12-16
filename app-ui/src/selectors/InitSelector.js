// @flow
import includes from 'lodash/includes';

/**
 * Selects initialization status of i18n
 * @param state
 * @returns Object
 */
export const isI18nInitialized = (state: Object) => state.init.i18n;

/**
 * Selects initialization status of app health
 * @param state
 * @returns {boolean}
 */
export const isHealthInitialized = (state: Object) => state.init.health;

/**
 * Selects user initialization status from state
 * @param state
 * @returns {boolean}
 */
export const isUserInitialized = (state: Object) => state.init.user;

/**
 * App initialization status
 * @param state
 * @returns {boolean}
 */
export const isInitialized = (state: Object) => !includes(state.init, false);
