import { isFSA } from 'flux-standard-action';
import signUpReducer, {
  modelPath,
  formState,
  signUp,
  signUpRequest,
} from 'bundles/Auth/modules/SignUpModule';

describe('(Redux Module) Auth/SignUpModule', () => {
  const initialState = {
    form: {},
    data: formState,
  };

  it('Should export the model path', () => {
    expect(modelPath).to.equal('auth.signUp.data');
  });


  it('Should export the initial form state', () => {
    expect(formState).to.eql({
      name: '',
      email: '',
      password: '',
    });
  });

  describe('(Action Creator) signUp', () => {
    it('Should be exported as a function', () => {
      expect(signUp).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signUp())).to.be.true();
    });
  });

  describe('(Action Creator) signUpRequest', () => {
    it('Should be a function', () => {
      expect(signUpRequest).to.be.a('function');
    });
    it('Should extract its id', () => {
      expect(signUpRequest()).to.be.a('string').that.is.equal(signUpRequest.id);
    });
  });

  describe('(Action Creator) signUpRequest#pending', () => {
    it('Should be exported as a function', () => {
      expect(signUpRequest.pending).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signUpRequest.pending())).to.be.true();
    });
  });

  describe('(Action Creator) signUpRequest#success', () => {
    it('Should be exported as a function', () => {
      expect(signUpRequest.success).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signUpRequest.success())).to.be.true();
    });
  });

  describe('(Action Creator) signUpRequest#failed', () => {
    it('Should be exported as a function', () => {
      expect(signUpRequest.failed).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signUpRequest.failed())).to.be.true();
    });
  });

  describe('(Reducer) resetPasswordReducer', () => {
    it('Should be a function', () => {
      expect(signUpReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(signUpReducer(undefined, { type: 'UNDEFINED' })).to.shallowDeepEqual(initialState);
    });
  });
});
