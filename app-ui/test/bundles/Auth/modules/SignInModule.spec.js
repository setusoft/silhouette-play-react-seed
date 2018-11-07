import { isFSA } from 'flux-standard-action';
import signInReducer, {
  modelPath,
  formState,
  signIn,
  signInRequest,
} from 'bundles/Auth/modules/SignInModule';

describe('(Redux Module) Auth/SignInModule', () => {
  const initialState = {
    form: {},
    data: formState,
  };

  it('Should export the model path', () => {
    expect(modelPath).to.equal('auth.signIn.data');
  });

  it('Should export the initial form state', () => {
    expect(formState).to.eql({
      email: '',
      password: '',
      rememberMe: false,
    });
  });

  describe('(Action Creator) signIn', () => {
    it('Should be exported as a function', () => {
      expect(signIn).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signIn())).to.be.true();
    });
  });

  describe('(Action Creator) signInRequest', () => {
    it('Should be a function', () => {
      expect(signInRequest).to.be.a('function');
    });

    it('Should extract its id', () => {
      expect(signInRequest()).to.be.a('string').that.is.equal(signInRequest.id);
    });
  });

  describe('(Action Creator) signInRequest#pending', () => {
    it('Should be exported as a function', () => {
      expect(signInRequest.pending).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signInRequest.pending())).to.be.true();
    });
  });

  describe('(Action Creator) signInRequest#success', () => {
    it('Should be exported as a function', () => {
      expect(signInRequest.success).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signInRequest.success())).to.be.true();
    });
  });

  describe('(Action Creator) signInRequest#failed', () => {
    it('Should be exported as a function', () => {
      expect(signInRequest.failed).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signInRequest.failed())).to.be.true();
    });
  });

  describe('(Reducer) resetPasswordReducer', () => {
    it('Should be a function', () => {
      expect(signInReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(signInReducer(undefined, { type: 'UNDEFINED' })).to.shallowDeepEqual(initialState);
    });
  });
});
