import sinon from 'sinon';
import { actions } from 'react-redux-form';
import { modelPath as signUpModelPath } from 'routes/Auth/modules/SignUpModule';
import { modelPath as signInModelPath } from 'routes/Auth/modules/SignInModule';
import { modelPath as recoverPasswordModelPath } from 'routes/Auth/modules/RecoverPasswordModule';
import { modelPath as resetPasswordModelPath, validatePasswordToken } from 'routes/Auth/modules/ResetPasswordModule';
import { activateAccount } from 'routes/Auth/modules/ActivateAccountModule';
import authRoute from 'routes/Auth';
import AuthLayout from 'routes/Auth/layouts/AuthLayout';
import SignInContainer from 'routes/Auth/containers/SignInContainer';
import SignUpContainer from 'routes/Auth/containers/SignUpContainer';
import RecoverPasswordContainer from 'routes/Auth/containers/RecoverPasswordContainer';
import ResetPasswordContainer from 'routes/Auth/containers/ResetPasswordContainer';
import ActivateAccountContainer from 'routes/Auth/containers/ActivateAccountContainer';
import config from 'config/index';

describe('(Route) Auth', () => {
  let store;
  let route;

  beforeEach(() => {
    store = {
      dispatch: sinon.spy(),
    };

    route = authRoute(store);
  });

  it('Should return a route configuration object', () => {
    expect(typeof route).to.equal('object');
  });

  describe('Configuration', () => {
    it('Should contain path `/auth`', () => {
      expect(route.path).to.equal(config.route.auth.index);
    });

    it('Should contain component `AuthLayout`', () => {
      expect(route.component).to.equal(AuthLayout);
    });

    it('Should redirect to `/auth/sign-in` on index route', () => {
      const replace = sinon.spy();
      route.indexRoute.onEnter({}, replace);

      expect(replace.firstCall.args[0]).to.eql(config.route.auth.signIn);
    });

    describe('(ChildRoute) /auth/sign-in', () => {
      it('Should contain path `/auth/sign-in`', () => {
        const childRoute = route.childRoutes[0];

        expect(childRoute.path).to.equal(config.route.auth.signIn);
      });

      it('Should contain component `SignInContainer`', () => {
        const childRoute = route.childRoutes[0];

        expect(childRoute.component).to.equal(SignInContainer);
      });

      it('Should reset the form on leave', () => {
        const childRoute = route.childRoutes[0];

        childRoute.onLeave();

        expect(store.dispatch.firstCall.args[0]).to.eql(actions.reset(signInModelPath));
      });
    });

    describe('(ChildRoute) /auth/sign-up', () => {
      it('Should contain path `/auth/sign-up`', () => {
        const childRoute = route.childRoutes[1];

        expect(childRoute.path).to.equal(config.route.auth.signUp);
      });

      it('Should contain component `SignUpContainer`', () => {
        const childRoute = route.childRoutes[1];

        expect(childRoute.component).to.equal(SignUpContainer);
      });

      it('Should reset the form on leave', () => {
        const childRoute = route.childRoutes[1];

        childRoute.onLeave();

        expect(store.dispatch.firstCall.args[0]).to.eql(actions.reset(signUpModelPath));
      });
    });

    describe('(ChildRoute) /auth/password/recovery', () => {
      it('Should contain path `/auth/password/recovery`', () => {
        const childRoute = route.childRoutes[2];

        expect(childRoute.path).to.equal(config.route.auth.passwordRecovery);
      });

      it('Should contain component `RecoverPasswordContainer`', () => {
        const childRoute = route.childRoutes[2];

        expect(childRoute.component).to.equal(RecoverPasswordContainer);
      });

      it('Should reset the form on leave', () => {
        const childRoute = route.childRoutes[2];

        childRoute.onLeave();

        expect(store.dispatch.firstCall.args[0]).to.eql(actions.reset(recoverPasswordModelPath));
      });
    });

    describe('(ChildRoute) /auth/password/recovery/:token', () => {
      it('Should contain path `/auth/password/recovery/:token`', () => {
        const childRoute = route.childRoutes[3];

        expect(childRoute.path).to.equal(`${config.route.auth.passwordRecovery}/:token`);
      });

      it('Should contain component `ResetPasswordContainer`', () => {
        const childRoute = route.childRoutes[3];

        expect(childRoute.component).to.equal(ResetPasswordContainer);
      });

      it('Should validate the token on enter', () => {
        const childRoute = route.childRoutes[3];
        const nextState = { params: { token: 'my-password-token' } };
        const replace = sinon.spy();
        const cb = sinon.spy();

        childRoute.onEnter(nextState, replace, cb);

        expect(store.dispatch.calledWithMatch(validatePasswordToken({ token: nextState.params.token }))).to.be.true();
      });

      it('Should reset the form on leave', () => {
        const childRoute = route.childRoutes[3];

        childRoute.onLeave();

        expect(store.dispatch.firstCall.args[0]).to.eql(actions.reset(resetPasswordModelPath));
      });
    });

    describe('(ChildRoute) /auth/account/activation', () => {
      it('Should contain path `/auth/account/activation`', () => {
        const childRoute = route.childRoutes[4];

        expect(childRoute.path).to.equal(config.route.auth.accountActivation);
      });

      it('Should contain component `ResetPasswordContainer`', () => {
        const childRoute = route.childRoutes[4];

        expect(childRoute.component).to.equal(ActivateAccountContainer);
      });

      it('Should redirect if the email is not contained in store', () => {
        store = {
          getState: () => ({ auth: { activateAccount: {} } }),
        };
        route = authRoute(store);

        const childRoute = route.childRoutes[4];
        const nextState = {};
        const replace = sinon.spy();
        const cb = sinon.spy();

        childRoute.onEnter(nextState, replace, cb);

        expect(replace.firstCall.args[0]).to.eql(config.route.auth.signIn);
        expect(cb.calledOnce).to.be.true();
      });

      it('Should not redirect if the email is contained in store', () => {
        store = {
          getState: () => ({ auth: { activateAccount: { email: 'test@test.com' } } }),
        };
        route = authRoute(store);

        const childRoute = route.childRoutes[4];
        const nextState = {};
        const replace = sinon.spy();
        const cb = sinon.spy();

        childRoute.onEnter(nextState, replace, cb);

        expect(replace.notCalled).to.be.true();
        expect(cb.calledOnce).to.be.true();
      });
    });

    describe('(ChildRoute) /auth/account/activation/:token', () => {
      it('Should contain path `/auth/account/activation/:token`', () => {
        const childRoute = route.childRoutes[5];

        expect(childRoute.path).to.equal(`${config.route.auth.accountActivation}/:token`);
      });

      it('Should not contain a component', () => {
        const childRoute = route.childRoutes[5];

        expect(childRoute.component).to.equal(undefined);
      });

      it('Should activate the account on enter', () => {
        const childRoute = route.childRoutes[5];
        const nextState = { params: { token: 'my-activation-token' } };
        const replace = sinon.spy();
        const cb = sinon.spy();

        childRoute.onEnter(nextState, replace, cb);

        expect(store.dispatch.calledWithMatch(activateAccount({ token: nextState.params.token }))).to.be.true();
      });
    });
  });
});
