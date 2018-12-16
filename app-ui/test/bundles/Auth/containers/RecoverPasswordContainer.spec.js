import { actions as formActions } from 'react-redux-form';
import config from 'config/index';
import { history } from 'modules/LocationModule';
import { onRecover, mapDispatchToProps } from 'bundles/Auth/containers/RecoverPasswordContainer';
import { recoverPasswordRequest, recoverPassword, modelPath } from 'bundles/Auth/modules/RecoverPasswordModule';

describe('(Container) RecoverPasswordContainer', () => {
  describe('onRecover', () => {
    let actions;

    beforeEach(() => {
      actions = {
        remove: sinon.spy(),
      };
    });

    it('Should be a function', () => {
      expect(onRecover).to.be.a('function');
    });

    it('Should move user to SignIn page', () => {
      const push = sinon.spy(history, 'push');
      const state = { data: { id: recoverPasswordRequest.id }, actions };
      const event = {};
      onRecover(event, state);

      expect(actions.remove).to.have.been.calledBefore(push);
      expect(push).to.have.been.calledOnceWithExactly(config.route.auth.signIn);
      push.restore();
    });
  });

  describe('mapDispatchToProps', () => {
    let dispatch;

    beforeEach(() => {
      dispatch = sinon.spy();
    });

    it('Should map function to ActivateAccount component props', () => {
      const props = mapDispatchToProps(dispatch);

      expect(props).to.have.all.keys(['onRecover', 'componentWillUnmount', 'onSend']);
    });

    it('Should dispatch `recoverPassword` when `onSend` is called', () => {
      const email = 'john@doe.com';
      const { onSend } = mapDispatchToProps(dispatch);
      onSend(email);

      expect(dispatch).to.have.been.calledOnceWithExactly(recoverPassword(email));
    });
  });


  describe('componentWillUnmount', () => {
    let componentWillUnmount;
    let dispatch;

    beforeEach(() => {
      dispatch = sinon.spy();
      /* eslint-disable prefer-destructuring */
      componentWillUnmount = mapDispatchToProps(dispatch).componentWillUnmount;
    });

    it('Should be a function', () => {
      expect(componentWillUnmount).to.be.a('function');
    });

    it('Should dispatch a form reset action when called', () => {
      componentWillUnmount();

      expect(dispatch).to.have.been.calledOnceWithExactly(formActions.reset(modelPath));
    });

  });
});
