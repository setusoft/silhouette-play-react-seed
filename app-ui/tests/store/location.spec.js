import {
  LOCATION_CHANGE,
  initialState,
  locationChange,
  updateLocation,
  default as locationReducer,
} from 'store/location';

describe('(Internal Module) Location', () => {
  it('Should export a constant LOCATION_CHANGE', () => {
    expect(LOCATION_CHANGE).to.equal('LOCATION_CHANGE');
  });

  describe('(Reducer)', () => {
    it('Should be a function', () => {
      expect(locationReducer).to.be.a('function');
    });

    it('Should initialize with a initial state', () => {
      expect(locationReducer(undefined, {})).to.equal(initialState);
    });

    it('Should return the previous state if an action was not matched', () => {
      let state = locationReducer(undefined, {});
      expect(state).to.equal(initialState);
      state = locationReducer(state, { type: '@@@@@@@' });
      expect(state).to.equal(initialState);

      const locationState = { pathname: '/yup' };
      state = locationReducer(state, locationChange(locationState));
      expect(state).to.equal(locationState);
      state = locationReducer(state, { type: '@@@@@@@' });
      expect(state).to.equal(locationState);
    });
  });

  describe('(Action Creator) locationChange', () => {
    it('Should be exported as a function', () => {
      expect(locationChange).to.be.a('function');
    });

    it('Should return an action with type "LOCATION_CHANGE"', () => {
      expect(locationChange()).to.have.property('type', LOCATION_CHANGE);
    });

    it('Should assign the first argument to the "payload" property', () => {
      const locationState = { pathname: '/yup' };
      expect(locationChange(locationState)).to.have.property('payload', locationState);
    });

    it('Should default the "payload" property to "/" if not provided', () => {
      expect(locationChange()).to.have.property('payload', '/');
    });
  });

  describe('(Specialized Action Creator) updateLocation', () => {
    let globalState;
    let dispatchSpy;

    beforeEach(() => {
      globalState = {
        location: locationReducer(undefined, {}),
      };
      dispatchSpy = sinon.spy((action) => {
        globalState = {
          ...globalState,
          location: locationReducer(globalState.location, action),
        };
      });
    });

    it('Should be exported as a function', () => {
      expect(updateLocation).to.be.a('function');
    });

    it('Should return a function (is a thunk)', () => {
      expect(updateLocation({ dispatch: dispatchSpy })).to.be.a('function');
    });

    it('Should call dispatch exactly once', () => {
      updateLocation({ dispatch: dispatchSpy })('/');
      expect(dispatchSpy.should.have.been.calledOnce);
    });
  });
});
