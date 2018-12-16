import { actions } from 'react-redux-form';
import { signIn, modelPath } from 'bundles/Auth/modules/SignInModule';
import { mapDispatchToProps } from 'bundles/Auth/containers/SignInContainer';

describe('(Container) SignInContainer', () => {
  describe('mapDispatchToProps', () => {
    let props;
    let dispatch;

    beforeEach(() => {
      dispatch = sinon.spy();
      props = mapDispatchToProps(dispatch);
    });

    it('Should have all required props', () => {
      expect(props).to.have.all.keys([
        'onSignIn',
        'componentWillUnmount',
      ]);
    });

    /* eslint-disable react/destructuring-assignment */
    it('#onSignIn Should dispatch a signIn action with sign-in data', () => {
      const data = { email: 'john@doe.com', password: 'strangeH45h' };
      props.onSignIn(data);

      expect(dispatch).to.have.been.calledOnceWithExactly(signIn(data));
    });

    it('#onSignIn Should dispatch a form reset action on signIn form modelPath', () => {
      props.componentWillUnmount();

      expect(dispatch).to.have.been.calledOnceWithExactly(actions.reset(modelPath));
    });
  });
});
