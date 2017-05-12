import { spawn } from 'redux-saga/effects';

/**
 * Returns an instantiable saga regarding if only a generator function was given or if already an
 * instantiable saga in the form [saga, params...] was given.
 *
 * @param saga The saga as generator function or in the form [saga, params...].
 * @return An array containing the saga as first value and additional parameters as following values.
 */
export const refineSaga = (saga) => {
  // Saga is a generator function without params
  if (typeof saga === 'function') {
    return [saga];
  }

  // Ensures that a saga in the form [saga, params...] was given
  if (Array.isArray(saga) && typeof saga[0] === 'function') {
    return saga;
  }

  throw Error(`Unexpected saga type: ${saga}`);
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
export const combineSagas = sagas => sagas.map(saga => spawn(...refineSaga(saga)));
