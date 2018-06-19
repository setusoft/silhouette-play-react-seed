import { expectSaga } from 'redux-saga-test-plan';
import { rootSaga } from 'store/sagas';
import healthSagaBinding from 'sagas/HealthSaga';
import configSagaBinding from 'sagas/ConfigSaga';
import i18nSagaBinding from 'sagas/I18nSaga';
import userSagaBinding from 'sagas/UserSaga';

describe('(Saga) sagas', () => {
  describe('(Generator) rootSaga', () => {
    it('Should spawn all sagas', () =>
      expectSaga(rootSaga)
        .spawn(...healthSagaBinding)
        .spawn(...configSagaBinding)
        .spawn(...i18nSagaBinding)
        .spawn(...userSagaBinding)
        .silentRun());
  });
});
