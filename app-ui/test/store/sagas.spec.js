import { expectSaga } from 'redux-saga-test-plan';
import { rootSaga } from 'store/sagas';
import i18nSagaBinding from 'sagas/I18nSaga';
import userSagaBinding from 'sagas/UserSaga';

describe('(Saga) sagas', () => {
  describe('(Generator) rootSaga', () => {
    it('Should spawn all sagas', () =>
      expectSaga(rootSaga)
        .spawn(...i18nSagaBinding)
        .spawn(...userSagaBinding)
        .run({ silenceTimeout: true }));
  });
});
