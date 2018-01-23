// @flow
import get from 'lodash/get';
import Alert from 'react-s-alert';
import { actions } from 'react-redux-form';
import { call, put, spawn } from 'redux-saga/effects';
import { APIError } from './API';

/**
 * Returns an instantiable saga regarding if only a generator function was given or if already an
 * instantiable saga in the form [saga, params...] was given.
 *
 * @param saga The saga as generator function or in the form [saga, params...].
 * @return An array containing the saga as first value and additional parameters as following values.
 * @throws TypeError if an unexpected saga type was given.
 */
export const refineSaga = (saga: * | Array<*>) => {
  // Saga is a generator function without params
  if (typeof saga === 'function') {
    return [saga];
  }

  // Ensures that a saga in the form [saga, params...] was given
  if (Array.isArray(saga) && typeof saga[0] === 'function') {
    return saga;
  }

  throw TypeError(`Unexpected saga type: ${saga.toString()}`);
};

/**
 * Combines multiple sagas into an array.
 *
 * We use spawn to detach parallel sagas, so that a failing saga doesn't kill all other sagas.
 *
 * https://github.com/redux-saga/redux-saga/issues/395
 * http://stackoverflow.com/questions/39438005/what-is-the-idiomatic-way-of-starting-rootsaga
 *
 * @param sagas The sagas to combine.
 */
export const combineSagas = (sagas: Array<*>) => sagas.map(saga => spawn(...refineSaga(saga)));

/**
 * Handles the errors in the catch block of a saga.
 *
 * @param e        The caught error.
 * @param handlers An object that can handle API errors for specific error codes.
 * @return An array of effects.
 * @throws All errors expect API errors.
 */
export const handleError = (e: Error | APIError, handlers: {[string]: (APIError) => Array<*>} = {}) => {
  if (e instanceof APIError) {
    const defaultHandler = (error: APIError) => ([call(Alert.error, error.response.description)]);
    return get(handlers, e.response.code, defaultHandler)(e);
  }

  throw e;
};

/**
 * A default form error handler that maps server side form errors to client side form errors.
 *
 * The form will be set to submitted, so that the error will be shown in the form. The `Form.jsx`.`showErrors`
 * function will show the error if the field was touched or submitted.
 *
 * @param modelPath The model path of the form.
 * @returns A list of put effects.
 */
export const formErrorHandler = (modelPath: string) => (error: APIError) => {
  const details = error.response.details || [];

  return [
    put(actions.setSubmitted(modelPath, true)),
    ...details.map(detail => put(actions.setErrors(`${modelPath}.${detail.key}`, detail.message))),
  ];
};
