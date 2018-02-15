import head from 'lodash/head';
import Alert from 'react-s-alert';
import { actions } from 'react-redux-form';
import { call, spawn } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { refineSaga, combineSagas, handleError, formErrorHandler } from 'util/Saga';
import { APIError, APIResponse } from 'util/API';

describe('(Util) Saga', () => {
  function* test() { while (true) { yield 1; } }
  const apiError = new APIError(new APIResponse('test', 'A form error', [
    {
      key: 'id',
      message: 'Invalid ID',
    },
    {
      key: 'email',
      message: 'Invalid email',
    },
  ]));

  describe('(Function) refineSaga', () => {
    it('Should be a function', () => {
      expect(refineSaga).to.be.a('function');
    });

    it('Should refine a given saga function into an array containing this saga function', () => {
      const refined = refineSaga(test);

      expect(refined).to.be.a('array');
      expect(head(refined)).to.eql(test);
    });

    it('Should return the param unchanged if an array with a saga function was given as first param', () => {
      const refined = refineSaga([test]);

      expect(refined).to.be.a('array');
      expect(head(refined)).to.eql(test);
    });

    it('Should throw an error if an unexpected param was given', () => {
      expect(() => refineSaga([1, test])).to.throw(TypeError);
    });
  });

  describe('(Function) combineSagas', () => {
    it('Should be a function', () => {
      expect(combineSagas).to.be.a('function');
    });

    it('Should combine sagas with spawn', () => {
      const combined = combineSagas([test, test]);

      expect(combined).to.be.a('array');
      expect(combined.length).to.equal(2);
      expect(combined[0]).to.eql(spawn(test));
      expect(combined[1]).to.eql(spawn(test));
    });
  });

  describe('(Function) handleError', () => {
    it('Should be a function', () => {
      expect(handleError).to.be.a('function');
    });

    it('Should use the default error handler if no additional handler was given', () => {
      function* testError() {
        yield handleError(apiError);
      }

      return expectSaga(testError)
        .call(Alert.error, apiError.response.description)
        .silentRun();
    });

    it('Should use the default error handler if no error handler for the error response code was given', () => {
      function* testError() {
        yield handleError(apiError, { notDefined: () => undefined });
      }

      return expectSaga(testError)
        .call(Alert.error, apiError.response.description)
        .silentRun();
    });

    it('Should use the matched error handler', () => {
      function* testError() {
        yield handleError(apiError, { test: error => ([call(Alert.info, error.response.description)]) });
      }

      return expectSaga(testError)
        .call(Alert.info, apiError.response.description)
        .silentRun();
    });

    it('Should throw an error for unhandled error types', () => {
      expect(() => handleError(new Error(), {})).to.throw(Error);
    });
  });

  describe('(Function) formErrorHandler', () => {
    it('Should be a function', () => {
      expect(formErrorHandler).to.be.a('function');
    });

    it('Should dispatch the `setErrors` action for every form error', () => {
      const modelPath = 'model';
      const { details } = apiError.response;
      function* testError() {
        yield handleError(apiError, { test: formErrorHandler(modelPath) });
      }

      return expectSaga(testError)
        .put(actions.setErrors(`${modelPath}.${details[0].key}`, details[0].message))
        .put(actions.setErrors(`${modelPath}.${details[1].key}`, details[1].message))
        .silentRun();
    });
  });
});
