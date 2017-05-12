// Uncomment the stuff to inject reducers
// import { injectReducer } from 'store/reducers';
import config from 'config/index';

export default (/* store */) => ({
  path: config.route.admin.index,

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Component = require('./layouts/AdminLayout').default;
      // const reducer = require('./modules/AdminModule').default;

      // injectReducer(store, { key: 'admin', reducer });

      cb(null, Component);
    }, 'admin');
  },
});
