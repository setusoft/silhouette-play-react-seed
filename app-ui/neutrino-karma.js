const { join } = require('path');

module.exports = (neutrino) => {
  const tests = join(neutrino.options.tests, '/test-bundler.js');
  const options = neutrino.options.karma;
  options.browsers = ['PhantomJS'];
  options.files = [
    'node_modules/babel-polyfill/dist/polyfill.js',
    {
      pattern: tests,
      watched: false,
      served: true,
      included: true,
    },
  ];
  options.plugins = [
    require.resolve('karma-webpack'),
    require.resolve('karma-phantomjs-launcher'),
    require.resolve('karma-coverage'),
    require.resolve('karma-mocha'),
    require.resolve('karma-mocha-reporter'),
  ];
  options.preprocessors = {
    [tests]: ['webpack'],
  };

  // Enzyme fix: https://github.com/airbnb/enzyme/issues/892#issuecomment-299660665
  neutrino.config.merge({ externals: {
    'react/addons': true,                      // pre-existing at enzyme 2.8.0
    'react/lib/ExecutionEnvironment': true,    // pre-existing at enzyme 2.8.0
    'react/lib/ReactContext': true,            // pre-existing at enzyme 2.8.0
    'react-dom/test-utils': true,
    'react-test-renderer/shallow': true,
  } });

  neutrino.config.devtool('cheap-module-source-map');
  neutrino.config.resolve.alias.set('sinon', 'sinon/pkg/sinon.js');
  neutrino.config.module.set('noParse', [
    /\/sinon\.js/,
  ]);
};
