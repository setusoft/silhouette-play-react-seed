import { isFSA } from 'flux-standard-action';
import activateAccountReducer, {
  initialState,
  saveActivationEmail,
  sendActivationEmail,
  sendActivationEmailPending,
  sendActivationEmailFulfilled,
  sendActivationEmailRejected,
  activateAccount,
} from 'routes/Auth/modules/ActivateAccountModule';

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

  describe('(Action Creator) sendActivationEmailPending', () => {
    it('Should be exported as a function', () => {
      expect(sendActivationEmailPending).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(sendActivationEmailPending())).to.be.true();
    });
  });

  describe('(Action Creator) sendActivationEmailFulfilled', () => {
    it('Should be exported as a function', () => {
      expect(sendActivationEmailFulfilled).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(sendActivationEmailFulfilled())).to.be.true();
    });
  });

  describe('(Action Creator) sendActivationEmailRejected', () => {
    it('Should be exported as a function', () => {
      expect(sendActivationEmailRejected).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(sendActivationEmailRejected())).to.be.true();
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
      state = activateAccountReducer(state, sendActivationEmailPending());
      expect(state).to.eql({ ...initialState, isPending: true });
      state = activateAccountReducer(state, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, isPending: true });
    });

    it('Should set `email` if the `saveActivationEmail` action was dispatched', () => {
      let state = activateAccountReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, email: '' });

      state = activateAccountReducer(state, saveActivationEmail('john@doe.com'));
      expect(state).to.eql({ ...initialState, email: 'john@doe.com' });
    });

    it('Should set `isPending` to true if the `sendActivationEmailPending` action was dispatched', () => {
      let state = activateAccountReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, isPending: false });

      state = activateAccountReducer(state, sendActivationEmailPending());
      expect(state).to.eql({ ...initialState, isPending: true });
    });

    it('Should set `isPending` to false if the `sendActivationEmailFulfilled` action was dispatched', () => {
      let state = activateAccountReducer(undefined, sendActivationEmailPending());
      expect(state).to.eql({ ...initialState, isPending: true });

      state = activateAccountReducer(state, sendActivationEmailFulfilled());
      expect(state).to.eql({ ...initialState, isPending: false });
    });

    it('Should set `email` to "" if the `sendActivationEmailFulfilled` action was dispatched', () => {
      let state = activateAccountReducer(undefined, saveActivationEmail('john@doe.com'));
      expect(state).to.eql({ ...initialState, email: 'john@doe.com' });

      state = activateAccountReducer(state, sendActivationEmailFulfilled());
      expect(state).to.eql({ ...initialState, email: '' });
    });

    it('Should set `isPending` to false if the `sendActivationEmailRejected` action was dispatched', () => {
      let state = activateAccountReducer(undefined, sendActivationEmailPending());
      expect(state).to.eql({ ...initialState, isPending: true });

      state = activateAccountReducer(state, sendActivationEmailRejected());
      expect(state).to.eql({ ...initialState, isPending: false });
    });
  });
});
