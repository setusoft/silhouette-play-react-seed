// @flow
import { i18n } from 'lingui-i18n';
import { createSelector } from 'reselect';

i18n.development(require('lingui-i18n/dev'));

export const getLanguage = (state: Object) => state.i18n.language;
export const getCatalog = (state: Object) => state.i18n.catalog;
export const getI18n = createSelector([getLanguage, getCatalog], (language, catalog) => {
  i18n.load({ [language]: catalog });
  i18n.activate(language);

  return i18n;
});
