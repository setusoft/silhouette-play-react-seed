// @flow

/**
 * Selects user data from state
 * @param state Redux state
 * @returns User model
 */
export const getUser = (state: Object) => state.user.model;

/**
 * Selects user id from state
 * @param state Redux state
 * @returns {string}
 */
export const getUserID = (state: Object) => getUser(state).id;

/**
 * Selects app user's name from state
 * @param state Redux state
 * @returns {string}
 */
export const getUserName = (state: Object) => getUser(state).name;
