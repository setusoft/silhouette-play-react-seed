import environments from 'config/environments';

// *******************************************
// Durations
// *******************************************
export const HEALT_DURATION = 10 * 1000; // Fetch the health state every 10 seconds
export const USER_DURATION = 5 * 60 * 1000; // Fetch the user data every 5 minutes

// *******************************************
// Config
// *******************************************
const config = {
  env: process.env.NODE_ENV || 'development',
  csrfCookieName: 'PLAY_CSRF_TOKEN',
  route: {
    index: '/',
    auth: {
      index: '/auth',
      signIn: '/auth/sign-in',
      signUp: '/auth/sign-up',
      passwordRecovery: '/auth/password/recovery',
      accountActivation: '/auth/account/activation',
    },
    admin: {
      index: '/admin',
    },
  },
};

// ========================================================
// Environment Configuration
// ========================================================
const overrides = environments[config.env];
if (overrides) {
  Object.assign(config, overrides(config));
}

export default config;
