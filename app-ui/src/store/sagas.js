import { combineSagas } from 'util/Saga';
import authSaga from 'routes/Auth/sagas/AuthSaga';

export default function* rootSaga() {
  yield combineSagas([
    authSaga,
  ]);
}
