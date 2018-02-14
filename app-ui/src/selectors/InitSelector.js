// @flow
import includes from 'lodash/includes';

// eslint-disable-next-line import/prefer-default-export
export const isInitialized = (state: Object) => !includes(state.init, false);
