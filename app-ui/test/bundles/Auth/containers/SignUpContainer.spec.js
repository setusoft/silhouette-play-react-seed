import { actions } from 'react-redux-form';
import { signUp, modelPath } from 'bundles/Auth/modules/SignUpModule';
import { mapDispatchToProps } from 'bundles/Auth/containers/SignUpContainer';

describe('(Container) SignUpContainer', () => {
  describe('mapDispatchToProps', () => {
    let props;
    let dispatch;

    beforeEach(() => {
      dispatch = sinon.spy();
      props = mapDispatchToProps(dispatch);
    });

    it('Should have all required props', () => {
      expect(props).to.have.all.keys([
        'onSignUp',
        'componentWillUnmount',
      ]);
    });

    /* eslint-disable react/destructuring-assignment */
    it('#onSignUp Should dispatch a signUp action with sign-up data', () => {
      const data = { name: 'John Doe', email: 'john@doe.com', password: 'strangeH45h' };
      props.onSignUp(data);

      expect(dispatch).to.have.been.calledOnceWithExactly(signUp(data));
    });

    it('#onSignUp Should dispatch a form reset action on signUp form modelPath', () => {
      props.componentWillUnmount();

      expect(dispatch).to.have.been.calledOnceWithExactly(actions.reset(modelPath));
    });
  });
});
