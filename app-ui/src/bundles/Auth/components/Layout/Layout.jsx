// @flow
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import CoreLayout from 'components/CoreLayout';
import Preloader from 'components/Preloader';
import { NotFoundRoute } from 'components/NotFound';
import lifecycle from 'containers/LifecycleContainer';
import SignInContainer from 'bundles/Auth/containers/SignInContainer';
import SignUpContainer from 'bundles/Auth/containers/SignUpContainer';
import RecoverPasswordContainer from 'bundles/Auth/containers/RecoverPasswordContainer';
import ResetPasswordContainer from 'bundles/Auth/containers/ResetPasswordContainer';
import ActivateAccountContainer from 'bundles/Auth/containers/ActivateAccountContainer';
import { activateAccount } from 'bundles/Auth/modules/ActivateAccountModule';
import config from 'config/index';

import './Layout.scss';

type RouteProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  match: Object,
};

export const TokenActivationComponent = ({ match }: RouteProps) => {
  const Component = lifecycle(Preloader, { componentWillMount: activateAccount(match.params.token) });
  return <Component />;
};

export default () => (
  <CoreLayout>
    <div className="auth-container">
      <Switch>
        <Redirect exact from={config.route.auth.index} to={config.route.auth.signIn} />
        <Route exact path={config.route.auth.signIn} component={SignInContainer} />
        <Route exact path={config.route.auth.signUp} component={SignUpContainer} />
        <Route exact path={config.route.auth.passwordRecovery} component={RecoverPasswordContainer} />
        <Route exact path={`${config.route.auth.passwordRecovery}/:token`} component={ResetPasswordContainer} />
        <Route exact path={config.route.auth.accountActivation} component={ActivateAccountContainer} />
        <Route exact path={`${config.route.auth.accountActivation}/:token`} render={TokenActivationComponent} />
        <NotFoundRoute />
      </Switch>
    </div>
  </CoreLayout>
);
