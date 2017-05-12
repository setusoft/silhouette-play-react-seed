import adminRoute from './Admin';
import authRoute from './Auth';

export default store => ({
  path: '/',
  indexRoute: { onEnter: (nextState, replace) => replace('/admin') },
  childRoutes: [
    adminRoute(store),
    authRoute(store),
  ],
});
