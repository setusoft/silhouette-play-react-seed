import { history } from 'modules/LocationModule';
import { onActivationSent, mapDispatchToProps } from 'bundles/Auth/containers/ActivateAccountContainer';
import { emailActivationRequest, sendActivationEmail } from 'bundles/Auth/modules/ActivateAccountModule';
import config from 'config/index';

describe('(Container) ActivateAccountContainer', () => {
  describe('onActivationSent', () => {
    let actions;

    beforeEach(() => {
      actions = {
        remove: sinon.spy(),
      };
    });

    it('Should move user to SignIn page', () => {
      const push = sinon.spy(history, 'push');
      const state = {
        data: { id: emailActivationRequest.id },
        actions,
      };
      const event = {};
      onActivationSent(event, state);

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

      expect(props).to.have.all.keys(['onActivationSent', 'componentWillMount', 'onSend']);
    });

    it('Should dispatch `sendActivationEmail` when `onSend` is called', () => {
      const email = 'john@doe.com';
      const { onSend } = mapDispatchToProps(dispatch);
      onSend(email);

      expect(dispatch).to.have.been.calledOnceWithExactly(sendActivationEmail(email));
    });
  });

  describe('componentWillMount', () => {
    let componentWillMount;
    let push;

    beforeEach(() => {
      /* eslint-disable prefer-destructuring */
      componentWillMount = mapDispatchToProps().componentWillMount;
      push = sinon.spy(history, 'push');
    });

    afterEach(() => {
      push.restore();
    });

    it('Should be a function', () => {
      expect(componentWillMount).to.be.a('function');
    });

    it('Should direct user to signIn page if `email` not provided', () => {
      componentWillMount();

      expect(push).to.have.been.calledOnceWithExactly(config.route.auth.signIn);
    });

    it('Should not direct user to signIn page if `email` is provided', () => {
      const email = 'john@doe.com';
      componentWillMount(email);

      expect(push).to.not.have.been.called();
    });
  });
});
