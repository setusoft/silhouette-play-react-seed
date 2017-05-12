import environments from 'config/environments';

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
