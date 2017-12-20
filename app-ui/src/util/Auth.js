import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import config from 'config/index';

/**
 * Should be used to allow only authenticated user.
 */
export const secured = connectedRouterRedirect({
  authenticatedSelector: state => state.user.data.id !== undefined,
  redirectPath: config.route.auth.signIn,
  wrapperDisplayName: 'secured',
});

/**
 * Should be used to allow only not authenticated user.
 */
export const unsecured = connectedRouterRedirect({
  authenticatedSelector: state => state.user.data.id === undefined,
  redirectPath: config.route.index,
  wrapperDisplayName: 'unsecured',
});
