// @flow
import get from 'lodash/get';

/* eslint-disable import/prefer-default-export */

/**
 * Selects current history location from state
 * @param state Redux state
 * @returns {string}
 */
export const getPathname = (state: Object) => get(state, 'pathname', window.location.pathname);
