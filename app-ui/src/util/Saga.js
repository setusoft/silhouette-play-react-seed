// @flow
import get from 'lodash/get';
import Alert from 'react-s-alert';
import { actions } from 'react-redux-form';
import {
  call, put, spawn, select,
} from 'redux-saga/effects';
import { getI18n } from 'selectors/I18nSelector';
import { APIError } from './API';

/**
 * Executing calls sequential.
 *
 * This is a counterpart to `all` which executes calls in parallel.
 *
 * @param calls The calls to execute.
 * @returns A generator.
 * @see https://stackoverflow.com/a/45377797/2153190
 */
export function* sequence(calls: Array<*>): Generator<*, *, *> {
  // eslint-disable-next-line no-restricted-syntax
  for (const c of calls) {
    yield c;
  }
}

/**
 * Returns an instantiable saga regarding if only a generator function was given or if already an
 * instantiable saga in the form [saga, params...] was given.
 *
 * @param saga The saga as generator function or in the form [saga, params...].
 * @return An array containing the saga as first value and additional parameters as following values.
 * @throws TypeError if an unexpected saga type was given.
 */
export const refineSaga = (saga: * | Array<*>): Array<*> => {
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
export const combineSagas = (sagas: any[]): any[] => sagas.map(saga => spawn(...refineSaga(saga)));

/**
 * Handles the errors in the catch block of a saga.
 *
 * @param e        The caught error.
 * @param handlers An object that can handle API errors for specific error codes.
 */
export function* handleError(
  e: Error | APIError,
  handlers: {[string]: (APIError) => Array<*>} = {},
): Generator<*, *, *> {
  if (e instanceof APIError) {
    const defaultHandler = (error: APIError) => ([call(Alert.error, error.response.description)]);
    yield sequence(get(handlers, e.response.code, defaultHandler)(e));
  } else {
    const i18n = yield select(getI18n);

    // TODO: Log error to API
    // eslint-disable-next-line no-console
    console.error(e);
    yield call(Alert.error, i18n.t`An unexpected error occurred! Please try again later.`);
  }
}

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
