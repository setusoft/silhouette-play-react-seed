import { isFSA } from 'flux-standard-action';
import userReducer, {
  initialState,
  initUser,
  fetchUser,
  saveUser,
  deleteUser,
  resetUserState,
} from 'routes/Auth/modules/UserModule';

describe('(Redux Module) Auth/UserModule', () => {
  const user = {
    name: 'John Doe',
    email: 'john@doe.com',
  };

  describe('(Action Creator) initUser', () => {
    it('Should be exported as a function', () => {
      expect(initUser).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(initUser())).to.be.true();
    });
  });

  describe('(Action Creator) fetchUser', () => {
    it('Should be exported as a function', () => {
      expect(fetchUser).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(fetchUser())).to.be.true();
    });
  });

  describe('(Action Creator) saveUser', () => {
    it('Should be exported as a function', () => {
      expect(saveUser).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(saveUser())).to.be.true();
    });
  });

  describe('(Action Creator) deleteUser', () => {
    it('Should be exported as a function', () => {
      expect(deleteUser).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(deleteUser())).to.be.true();
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

    it('Should initialize the user with data if the `initUser` action was dispatched with data', () => {
      let state = userReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql(initialState);

      state = userReducer(state, initUser({ name: 'test' }));
      expect(state).to.eql({ ...initialState, data: { name: 'test' }, initialized: true });
    });

    it('Should initialize the user without data if the `initUser` action was dispatched without data', () => {
      let state = userReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql(initialState);

      state = userReducer(state, initUser());
      expect(state).to.eql({ ...initialState, initialized: true });
    });

    it('Should save the user if the `saveUser` action was dispatched', () => {
      let state = userReducer(undefined, { type: 'UNDEFINED' });
      expect(state).to.eql(initialState);

      state = userReducer(state, saveUser(user));
      expect(state).to.eql({ ...initialState, data: user });
    });

    it('Should delete the user if the `deleteUser` action was dispatched', () => {
      let state = userReducer(undefined, saveUser(user));
      expect(state).to.eql({ ...initialState, data: user });

      state = userReducer(state, deleteUser());
      expect(state).to.eql(initialState);
    });
  });
});
