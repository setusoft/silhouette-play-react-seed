/* eslint-disable babel/new-cap */
import { UserAuthWrapper } from 'redux-auth-wrapper';
import config from 'config/index';

/**
 * Should be used to allow only authenticated user.
 */
export const secured = UserAuthWrapper({
  authSelector: state => state.auth.user.data,
  predicate: user => user.id,
  failureRedirectPath: config.route.auth.signIn,
  wrapperDisplayName: 'secured',
});

/**
 * Should be used to allow only not authenticated user.
 */
export const unsecured = UserAuthWrapper({
  authSelector: state => state.auth.user.data,
  predicate: user => !user.id,
  failureRedirectPath: config.route.index,
  wrapperDisplayName: 'unsecured',
});
