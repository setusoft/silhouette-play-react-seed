// @flow
import { createAction, handleActions } from 'redux-actions';

export const initialState = {
  language: 'de',
  isPending: false,
  catalog: {},
};

export const getLanguage = (state: Object) => state.i18n.language;
export const getCatalog = (state: Object) => state.i18n.catalog;

export const setLanguage = createAction('I18N_SET_LANGUAGE');

export const fetchCatalog = createAction('I18N_FETCH_CATALOG');
export const fetchCatalogPending = createAction('I18N_FETCH_CATALOG_PENDING');
export const fetchCatalogFulfilled = createAction('I18N_FETCH_CATALOG_FULFILLED');
export const fetchCatalogRejected = createAction('I18N_FETCH_CATALOG_REJECTED');

export default handleActions({
  [setLanguage]: (state, action) => ({ ...state, language: action.payload }),
  [fetchCatalogPending]: state => ({ ...state, isPending: true }),
  [fetchCatalogFulfilled]: (state, action) => ({ ...state, isPending: false, catalog: action.payload }),
  [fetchCatalogRejected]: state => ({ ...state, isPending: false }),
}, initialState);
