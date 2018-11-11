// @flow
import { i18n } from '@lingui/core';
import { createSelector } from 'reselect';

/**
 * Selects app language from state
 * @param state
 * @returns {string}
 */
export const getLanguage = (state: Object) => state.i18n.language;

/**
 * Selects the i18n language catalog from state
 * @param state
 * @returns {|{}|initialState.catalog}
 */
export const getCatalog = (state: Object) => state.i18n.catalog;

/**
 * Selects i18n data from state
 * @returns Object
 */
export const getI18n = createSelector([getLanguage, getCatalog], (language, catalog) => {
  i18n.load({ [language]: catalog });
  i18n.activate(language);

  return i18n;
});
