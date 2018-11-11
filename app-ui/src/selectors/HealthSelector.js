// @flow

/**
 * Selects pending status of health request from redux state
 * @param state
 * @returns {boolean}
 */
export const isPending = (state: Object) => state.health.isPending;

/**
 * Selects health data from redux state
 * @param state
 * @returns {boolean}
 */
export const isHealthy = (state: Object) => state.health.isHealthy;
