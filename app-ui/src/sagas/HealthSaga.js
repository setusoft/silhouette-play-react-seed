// @flow
import { delay } from 'redux-saga';
import {
  call, put, take, select, all, race, fork, cancel,
} from 'redux-saga/effects';
import { isHealthy } from 'selectors/HealthSelector';
import { initApp, setHealthInitialized } from 'modules/InitModule';
import {
  fetchHealth,
  fetchHealthPending,
  fetchHealthFulfilled,
  fetchHealthRejected,
  changeToHealthy,
  changeToUnhealthy,
} from 'modules/HealthModule';
import { combineSagas } from 'util/Saga';
import { HEALT_DURATION } from 'config/index';
import HealthAPI from 'apis/HealthAPI';

/**
 * Worker which sets the initialized state for the health status.
 *
 * The app uses a loading indicator to show if the app was successfully initialized. The health is a fundamental part
 * of the initialization process, because it might be the case that some service components are out of order.
 *
 * The initialization is fulfilled either if the health status was successfully fetched or if the health status failed.
 */
export function* initHealthWorker(): Generator<*, *, *> {
  while (yield take([fetchHealthFulfilled().type, fetchHealthRejected().type])) {
    yield put(setHealthInitialized());
  }
}

/**
 * Worker which handles the app initialization.
 *
 * The initialization process is a one-time task, therefore we register our `initHealthWorker` task and cancel it
 * after it was finished.
 */
export function* initAppWorker(): Generator<*, *, *> {
  const task = yield fork(initHealthWorker);
  yield take(initApp().type);
  yield put(fetchHealth());
  yield take(setHealthInitialized);
  yield cancel(task);
}

/**
 * Worker which fetches the health status from backend.
 *
 * This worker will also dispatch health state transition actions.
 */
export function* fetchHealthWorker(api: HealthAPI): Generator<*, *, *> {
  while (yield take(fetchHealth().type)) {
    const previousHealthState = yield select(isHealthy);
    try {
      yield put(fetchHealthPending());
      yield call([api, api.get]);
      yield put(fetchHealthFulfilled());
      if (previousHealthState === false || previousHealthState === undefined) yield put(changeToHealthy());
    } catch (e) {
      yield put(fetchHealthRejected(e));
      if (previousHealthState === true || previousHealthState === undefined) yield put(changeToUnhealthy());
    }
  }
}

/**
 * Worker which fetches the health state periodically.
 *
 * @param duration The duration after the which the health state should be fetched periodically.
 */
export function* fetchHealthPeriodicallyWorker(duration: number): Generator<*, *, *> {
  while (true) {
    yield race({
      tick: call(delay, duration),
    });

    yield put(fetchHealth());
  }
}

export function* healthSaga(api: HealthAPI): Generator<*, *, *> {
  yield all(combineSagas([
    initAppWorker,
    [fetchHealthWorker, api],
    [fetchHealthPeriodicallyWorker, HEALT_DURATION],
  ]));
}

const api = new HealthAPI();
export default [healthSaga, api];
