import { actions } from 'react-redux-form';
import config from 'config/index';
import { history } from 'modules/LocationModule';
import { mapDispatchToProps } from 'bundles/Auth/containers/ResetPasswordContainer';
import { resetPassword, validatePasswordToken, modelPath } from 'bundles/Auth/modules/ResetPasswordModule';

describe('(Container) ResetPasswordContainer', () => {
  describe('mapDispatchToProps', () => {
    let props;
    let dispatch;
    let push;
    let token;

    beforeEach(() => {
      token = 'token12345';
      push = sinon.spy(history, 'push');
      dispatch = sinon.spy();
      props = mapDispatchToProps(dispatch, { match: { params: { token } } });
    });

    afterEach(() => {
      push.restore();
    });

    it('Should be a function', () => {
      expect(mapDispatchToProps).to.be.a('function');
    });

    it('Should have all required props', () => {
      expect(props).to.have.all.keys([
        'onResetFailure',
        'onResetSuccess',
        'onReset',
        'componentWillMount',
        'componentWillUnmount',
      ]);
    });

    /* eslint-disable react/destructuring-assignment */

    it('#onResetFailure Should direct user to recover password page', () => {
      props.onResetFailure();

      expect(push).to.have.been.calledOnceWithExactly(config.route.auth.passwordRecovery);
    });

    it('#onResetSuccess Should direct user to signIn page', () => {
      props.onResetSuccess();

      expect(push).to.have.been.calledOnceWithExactly(config.route.auth.signIn);
    });

    it('#onReset Should dispatch `resetPassword` action with data', () => {
      const data = { token, data: 'john@doe.com' };
      props.onReset(token, 'john@doe.com');

      expect(dispatch).to.have.been.calledOnceWithExactly(resetPassword(data));
    });

    it('#componentWillMount Should dispatch `validatePasswordToken` action with data', () => {
      props.componentWillMount();

      expect(dispatch).to.have.been.calledOnceWithExactly(validatePasswordToken(token));
    });

    it('#componentWillUnmount Should dispatch a form reset action on reset password form modelPath', () => {
      props.componentWillUnmount();

      expect(dispatch).to.have.been.calledOnceWithExactly(actions.reset(modelPath));
    });
  });
});
