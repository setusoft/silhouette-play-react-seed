import React from 'react';
import { shallow } from 'enzyme';
import { Redirect, Route, Switch } from 'react-router-dom';
import CoreLayout from 'components/CoreLayout';
import { NotFoundRoute } from 'components/NotFound';
import Layout from 'bundles/Auth/components/Layout';
import { TokenActivationComponent } from 'bundles/Auth/components/Layout/Layout';
import SignInContainer from 'bundles/Auth/containers/SignInContainer';
import SignUpContainer from 'bundles/Auth/containers/SignUpContainer';
import RecoverPasswordContainer from 'bundles/Auth/containers/RecoverPasswordContainer';
import ResetPasswordContainer from 'bundles/Auth/containers/ResetPasswordContainer';
import ActivateAccountContainer from 'bundles/Auth/containers/ActivateAccountContainer';
import config from 'config/index';

describe('(Component) Auth/Layout', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Layout />);
  });

  it('Should contain the `Provider` as root element', () => {
    expect(wrapper.first().is(CoreLayout)).to.be.true();
  });

  it('Should contain a div with the class name `auth-container`', () => {
    expect(wrapper.find('div.auth-container')).to.have.length(1);
  });

  it('Should contain the `Switch` component as child of the `auth-container` div', () => {
    expect(wrapper.find('div.auth-container').children().first().is(Switch)).to.be.true();
  });

  describe('(Component) Switch', () => {
    it('Should contain a redirect from /auth to /auth/sign-in at index 0', () => {
      const redirect = <Redirect exact from={config.route.auth.index} to={config.route.auth.signIn} />;

      expect(wrapper.find(Switch).children().at(0).contains(redirect)).to.be.true();
    });

    it('Should contain the /auth/sign-in route at index 1', () => {
      const route = <Route exact path={config.route.auth.signIn} component={SignInContainer} />;

      expect(wrapper.find(Switch).children().at(1).contains(route)).to.be.true();
    });

    it('Should contain the /auth/sign-up route at index 2', () => {
      const route = <Route exact path={config.route.auth.signUp} component={SignUpContainer} />;

      expect(wrapper.find(Switch).children().at(2).contains(route)).to.be.true();
    });

    it('Should contain the /auth/password/recovery route at index 3', () => {
      const route = <Route exact path={config.route.auth.passwordRecovery} component={RecoverPasswordContainer} />;

      expect(wrapper.find(Switch).children().at(3).contains(route)).to.be.true();
    });

    it('Should contain the /auth/password/recovery:token route at index 4', () => {
      const route = (
        <Route exact path={`${config.route.auth.passwordRecovery}/:token`} component={ResetPasswordContainer} />
      );

      expect(wrapper.find(Switch).children().at(4).contains(route)).to.be.true();
    });

    it('Should contain the /auth/account/activation route at index 5', () => {
      const route = <Route exact path={config.route.auth.accountActivation} component={ActivateAccountContainer} />;

      expect(wrapper.find(Switch).children().at(5).contains(route)).to.be.true();
    });

    it('Should contain the /auth/account/activation:token route at index 6', () => {
      const route = (
        <Route exact path={`${config.route.auth.accountActivation}/:token`} render={TokenActivationComponent} />
      );

      expect(wrapper.find(Switch).children().at(6).contains(route)).to.be.true();
    });

    it('Should contain the not found route as last', () => {
      expect(wrapper.find(Switch).children().last().is(NotFoundRoute)).to.be.true();
    });
  });
});
