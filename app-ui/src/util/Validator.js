// @flow
import isEmpty from 'validator/lib/isEmpty';

/* eslint-disable import/prefer-default-export */
export const isRequired = (val: string): boolean => !isEmpty(val);
