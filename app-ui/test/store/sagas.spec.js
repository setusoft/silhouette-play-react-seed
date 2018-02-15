import { expectSaga } from 'redux-saga-test-plan';
import { rootSaga } from 'store/sagas';
import initSagaBinding from 'sagas/InitSaga';
import i18nSagaBinding from 'sagas/I18nSaga';
import userSagaBinding from 'sagas/UserSaga';

describe('(Saga) sagas', () => {
  describe('(Generator) rootSaga', () => {
    it('Should spawn all sagas', () =>
      expectSaga(rootSaga)
        .spawn(...initSagaBinding)
        .spawn(...i18nSagaBinding)
        .spawn(...userSagaBinding)
        .silentRun());
  });
});
