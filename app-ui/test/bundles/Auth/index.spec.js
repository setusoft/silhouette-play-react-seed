import createStore from 'store/createStore';
import auth from 'bundles/Auth';
import Layout from 'bundles/Auth/components/Layout';
import reducer from 'bundles/Auth//modules/AuthModule';
import saga from 'bundles/Auth//sagas/AuthSaga';

describe('(Bundle) Auth', () => {
  let store;

  beforeEach(() => {
    store = createStore({});
  });

  it('Should be exported as function', () => {
    expect(typeof auth).to.equal('function');
  });

  it('Should inject the reducer', () => {
    auth(store);

    expect(store.asyncReducers).to.eql({ auth: reducer });
  });

  it('Should inject the saga', () => {
    auth(store);

    expect(store.asyncSagas).to.eql({ auth: saga });
  });

  it('Should return the `Layout` component', () => {
    expect(auth(store)).to.eql(Layout);
  });
});
