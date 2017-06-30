// @flow
import { createAction, handleActions } from 'redux-actions';

export const initialState = {
  language: 'en',
  catalog: {
    initialized: false,
    isPending: false,
    messages: {},
  },
};

export const setLanguage = createAction('I18N_SET_LANGUAGE');

export const initializeCatalog = createAction('I18N_INITIALIZE_CATALOG');

export const fetchCatalog = createAction('I18N_FETCH_CATALOG');
export const fetchCatalogPending = createAction('I18N_FETCH_CATALOG_PENDING');
export const fetchCatalogFulfilled = createAction('I18N_FETCH_CATALOG_FULFILLED');
export const fetchCatalogRejected = createAction('I18N_FETCH_CATALOG_REJECTED');

export const saveCatalog = createAction('I18N_SAVE_CATALOG');

export default handleActions({
  [setLanguage]: (state, action) => ({ ...state, language: action.payload }),
  [initializeCatalog]: state => ({ ...state, catalog: { ...state.catalog, initialized: true } }),
  [fetchCatalogPending]: state => ({ ...state, catalog: { ...state.catalog, isPending: true } }),
  [fetchCatalogFulfilled]: state => ({ ...state, catalog: { ...state.catalog, isPending: false } }),
  [fetchCatalogRejected]: state => ({ ...state, catalog: { ...state.catalog, isPending: false } }),
  [saveCatalog]: (state, action) => ({ ...state, catalog: { ...state.catalog, messages: action.payload } }),
}, initialState);
