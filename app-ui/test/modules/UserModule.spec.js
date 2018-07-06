import { isFSA } from 'flux-standard-action';
import userReducer, {
  initialState,
  fetchUser,
  fetchUserPending,
  fetchUserFulfilled,
  fetchUserRejected,
  signOutUser,
  resetUserState,
} from 'modules/UserModule';

describe('(Redux Module) UserModule', () => {
  const user = {
    name: 'John Doe',
    email: 'john@doe.com',
  };

  describe('(Action Creator) fetchUser', () => {
    it('Should be exported as a function', () => {
      expect(fetchUser).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchUser())).to.be.true();
    });
  });

  describe('(Action Creator) fetchUserPending', () => {
    it('Should be exported as a function', () => {
      expect(fetchUserPending).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchUserPending())).to.be.true();
    });
  });

  describe('(Action Creator) fetchUserFulfilled', () => {
    it('Should be exported as a function', () => {
      expect(fetchUserFulfilled).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchUserFulfilled())).to.be.true();
    });
  });

  describe('(Action Creator) fetchUserRejected', () => {
    it('Should be exported as a function', () => {
      expect(fetchUserRejected).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchUserRejected())).to.be.true();
    });
  });

  describe('(Action Creator) signOutUser', () => {
    it('Should be exported as a function', () => {
      expect(signOutUser).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signOutUser())).to.be.true();
    });
  });

  describe('(Action Creator) resetUserState', () => {
    it('Should be exported as a function', () => {
      expect(resetUserState).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(resetUserState())).to.be.true();
    });
  });

  describe('(Reducer) userReducer', () => {
    it('Should be a function', () => {
      expect(userReducer).to.be.a('function');
    });

    it('Should initialize with the initial state', () => {
      expect(userReducer(undefined, { type: 'UNDEFINED' })).to.eql(initialState);
    });

    it('Should set `isPending` to true if the `fetchUserPending` action was dispatched', () => {
      let state = userReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql({ ...initialState, isPending: false });

      state = userReducer(state, fetchUserPending());
      expect(state).to.eql({ ...initialState, isPending: true });
    });

    it('Should set `isPending` to false and the user if the `fetchUserFulfilled` '
      + 'action was dispatched', () => {
      let state = userReducer(undefined, fetchUserPending());
      expect(state).to.eql({ ...initialState, isPending: true });

      state = userReducer(state, fetchUserFulfilled(user));
      expect(state).to.eql({ ...initialState, isPending: false, model: user });
    });

    it('Should set `isPending` to false if the `fetchUserRejected` action was '
      + 'dispatched', () => {
      let state = userReducer(undefined, fetchUserPending());
      expect(state).to.eql({ ...initialState, isPending: true });

      state = userReducer(state, fetchUserRejected());
      expect(state).to.eql({ ...initialState, isPending: false });
    });
  });
});
