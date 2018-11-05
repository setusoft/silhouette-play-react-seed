import { isFSA } from 'flux-standard-action';
import activateAccountReducer, {
  initialState,
  saveActivationEmail,
  sendActivationEmail,
  emailActivationRequest,
  activateAccount,
} from 'bundles/Auth/modules/ActivateAccountModule';

describe('(Redux Module) Auth/ActivateAccountModule', () => {
  describe('(Action Creator) saveActivationEmail', () => {
    it('Should be exported as a function', () => {
      expect(saveActivationEmail).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(saveActivationEmail())).to.be.true();
    });
  });

  describe('(Action Creator) sendActivationEmail', () => {
    it('Should be exported as a function', () => {
      expect(sendActivationEmail).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(sendActivationEmail())).to.be.true();
    });
  });

  describe('(Action Creator) emailActivationRequest', () => {
    it('Should be a function', () => {
      expect(emailActivationRequest).to.be.a('function');
    });
    it('Should return its id', () => {
      expect(emailActivationRequest()).to.be.equal(emailActivationRequest.id)
    })
  });

  describe('(Action Creator) emailActivationRequest#pending', () => {
    it('Should be exported as a function', () => {
      expect(emailActivationRequest.pending).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(emailActivationRequest.pending())).to.be.true();
    });
  });

  describe('(Action Creator) emailActivationRequest#success', () => {
    it('Should be exported as a function', () => {
      expect(emailActivationRequest.success).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(emailActivationRequest.success())).to.be.true();
    });
  });

  describe('(Action Creator) emailActivationRequest#failed', () => {
    it('Should be exported as a function', () => {
      expect(emailActivationRequest.failed).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(emailActivationRequest.failed())).to.be.true();
    });
  });

  describe('(Action Creator) activateAccount', () => {
    it('Should be exported as a function', () => {
      expect(activateAccount).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(activateAccount())).to.be.true();
    });
  });

  describe('(Reducer)', () => {
    it('Should be a function', () => {
      expect(activateAccountReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(activateAccountReducer(undefined, { type: 'UNDEFINED' })).to.eql(initialState);
    });

    it('Should return the previous state if an action was not matched', () => {
      let state = activateAccountReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql(initialState);
      state = activateAccountReducer(state, { type: 'UNDEFINED' });
      expect(state).to.eql(initialState);
    });

    it('Should set `email` if the `saveActivationEmail` action was dispatched', () => {
      let state = activateAccountReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, email: '' });

      state = activateAccountReducer(state, saveActivationEmail('john@doe.com'));
      expect(state).to.eql({ ...initialState, email: 'john@doe.com' });
    });

  });
});
