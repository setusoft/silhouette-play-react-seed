import { actions } from 'react-redux-form';
import { modelPath as signUpModelPath } from 'routes/Auth/modules/SignUpModule';
import { modelPath as signInModelPath } from 'routes/Auth/modules/SignInModule';
import { modelPath as recoverPasswordModelPath } from 'routes/Auth/modules/RecoverPasswordModule';
import { modelPath as resetPasswordModelPath, validatePasswordToken } from 'routes/Auth/modules/ResetPasswordModule';
import { activateAccount } from 'routes/Auth/modules/ActivateAccountModule';
import AuthLayout from 'routes/Auth/layouts/AuthLayout';
import SignInContainer from 'routes/Auth/containers/SignInContainer';
import SignUpContainer from 'routes/Auth/containers/SignUpContainer';
import RecoverPasswordContainer from 'routes/Auth/containers/RecoverPasswordContainer';
import ResetPasswordContainer from 'routes/Auth/containers/ResetPasswordContainer';
import ActivateAccountContainer from 'routes/Auth/containers/ActivateAccountContainer';
import config from 'config/index';

export default store => ({
  path: config.route.auth.index,
  component: AuthLayout,
  indexRoute: { onEnter: (nextState, replace) => replace(config.route.auth.signIn) },
  childRoutes: [
    {
      path: config.route.auth.signIn,
      component: SignInContainer,
      onLeave: () => store.dispatch(actions.reset(signInModelPath)),
    },
    {
      path: config.route.auth.signUp,
      component: SignUpContainer,
      onLeave: () => store.dispatch(actions.reset(signUpModelPath)),
    },
    {
      path: config.route.auth.passwordRecovery,
      component: RecoverPasswordContainer,
      onLeave: () => store.dispatch(actions.reset(recoverPasswordModelPath)),
    },
    {
      path: `${config.route.auth.passwordRecovery}/:token`,
      component: ResetPasswordContainer,
      onEnter: (nextState, replace, cb) => {
        store.dispatch(validatePasswordToken({
          token: nextState.params.token,
          cb: (route) => { if (route) { replace(route); } cb(); },
        }));
      },
      onLeave: () => store.dispatch(actions.reset(resetPasswordModelPath)),
    },
    {
      path: config.route.auth.accountActivation,
      component: ActivateAccountContainer,
      onEnter: (nextState, replace, cb) => {
        if (!store.getState().auth.activateAccount.email) {
          replace(config.route.auth.signIn);
        }
        cb();
      },
    },
    {
      path: `${config.route.auth.accountActivation}/:token`,
      onEnter: (nextState, replace, cb) => {
        store.dispatch(activateAccount({
          token: nextState.params.token,
          cb: (route) => { replace(route); cb(); },
        }));
      },
    },
  ],
});
