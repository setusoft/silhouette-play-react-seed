import head from 'lodash/head';
import Alert from 'react-s-alert';
import { i18n } from '@lingui/core';
import { actions } from 'react-redux-form';
import { call, spawn, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { getI18n } from 'selectors/I18nSelector';
import {
  refineSaga, combineSagas, handleError, formErrorHandler,
} from 'util/Saga';
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

  describe('(Generator) handleError', () => {
    it('Should be a generator function', () => {
      expect(handleError[Symbol.toStringTag]).to.equal('GeneratorFunction');
    });

    it('Should use the default error handler if no additional handler was given', () => {
      expectSaga(handleError, apiError)
        .call(Alert.error, apiError.response.description)
        .silentRun();
    });

    it('Should use the default error handler if no error handler for the error response code was given', () => {
      expectSaga(handleError, apiError, { notDefined: () => undefined })
        .call(Alert.error, apiError.response.description)
        .silentRun();
    });

    it('Should use the matched error handler', () => {
      expectSaga(handleError, apiError, { test: error => ([call(Alert.info, error.response.description)]) })
        .call(Alert.info, apiError.response.description)
        .silentRun();
    });

    it('Should show the alert notifier for unhandled error types', () => expectSaga(handleError, new Error())
      .provide([[select(getI18n), i18n]])
      .call(Alert.error, 'An unexpected error occurred! Please try again later.')
      .silentRun());
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
