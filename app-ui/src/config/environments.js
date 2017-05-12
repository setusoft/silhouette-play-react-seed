const apiBaseUrl = `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}`;

export default {
  // ======================================================
  // Overrides when NODE_ENV === 'test'
  // ======================================================
  test: () => ({
    apiBaseUrl: 'http://localhost',
  }),

  // ======================================================
  // Overrides when NODE_ENV === 'development'
  // ======================================================
  development: () => ({
    apiBaseUrl: 'http://localhost:9000',
  }),

  // ======================================================
  // Overrides when NODE_ENV === 'production'
  // ======================================================
  production: () => ({
    apiBaseUrl,
  }),
};
