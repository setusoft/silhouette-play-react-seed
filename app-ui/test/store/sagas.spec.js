import { expectSaga } from 'redux-saga-test-plan';
import rootSaga from 'store/sagas';
import authSaga from 'routes/Auth/sagas/AuthSaga';

describe('(Saga) sagas', () => {
  describe('(Generator) rootSaga', () => {
    it('Should spawn all sagas', () =>
      expectSaga(rootSaga)
        .spawn(authSaga)
        .run({ silenceTimeout: true }),
    );
  });
});
