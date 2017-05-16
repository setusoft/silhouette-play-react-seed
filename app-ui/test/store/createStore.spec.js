import createStore from 'store/createStore';

describe('(Store) createStore', () => {
  let store;

  before(() => {
    store = createStore();
  });

  it('should have an empty asyncReducers object', () => {
    expect(store.asyncReducers).to.be.an('object');
    expect(store.asyncReducers).to.be.empty();
  });

  it('should have an empty asyncSagas object', () => {
    expect(store.asyncSagas).to.be.an('object');
    expect(store.asyncSagas).to.be.empty();
  });

  describe('(Location)', () => {
    it('store should be initialized with Location state', () => {
      const location = {
        pathname: '/echo',
      };
      store.dispatch({
        type: 'LOCATION_CHANGE',
        payload: location,
      });
      expect(store.getState().location).to.eql(location);
    });
  });
});
