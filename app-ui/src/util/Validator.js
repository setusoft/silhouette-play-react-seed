// @flow
/* eslint-disable import/prefer-default-export */
export const isRequired = (val: string): boolean => (typeof val === 'string' && val.length !== 0);
