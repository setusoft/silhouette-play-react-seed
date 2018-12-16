// @flow
/* eslint-disable import/prefer-default-export */

/**
 * Selects config data from redux state
 * @param state
 * @returns {Object}
 */
export const getConfig = (state: Object) => state.config.model;
