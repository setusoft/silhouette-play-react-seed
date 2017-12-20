import { injectReducer } from 'store/reducers';
import { injectSaga } from 'store/sagas';
import reducer from './modules/AuthModule';
import saga from './sagas/AuthSaga';
import Layout from './components/Layout';

export default (store) => {
  injectReducer(store, { key: 'auth', reducer });
  injectSaga(store, { key: 'auth', saga });

  return Layout;
};
