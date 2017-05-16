// Uncomment the stuff to inject reducers or sagas for code splitting (https://webpack.js.org/guides/code-splitting/)
// import { injectReducer } from 'store/reducers';
// import { injectSaga } from 'store/sagas';
import config from 'config/index';

export default (/* store */) => ({
  path: config.route.admin.index,

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Component = require('./layouts/AdminLayout').default;
      // const reducer = require('./modules/AdminModule').default;
      // const saga = require('./sagas/AdminSaga').default;

      // injectReducer(store, { key: 'admin', reducer });
      // injectSaga(store, { key: 'admin', saga });

      cb(null, Component);
    }, 'admin');
  },
});
