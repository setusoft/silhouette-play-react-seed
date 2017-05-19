const { join } = require('path');

module.exports = (neutrino) => {
  const tests = join(neutrino.options.tests, '**/test-bundler.js');
  const options = neutrino.options.karma;
  options.browsers = ['PhantomJS'];
  // Include babel-polyfill to support ES6 Promises with fetch-mock
  options.files = ['node_modules/babel-polyfill/dist/polyfill.js', tests];
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
  options.coverageReporter = {
    dir: '.coverage',
    reporters: [
      { type: 'text-summary' },
      { type: 'html', subdir: 'report-html' },
      { type: 'lcov', subdir: 'report-lcov' },
    ],
  };
  // Activate logging for tests
  options.browserConsoleLogOptions = {
    level: 'log',
    format: '%b %T: %m',
    terminal: true,
  };
  options.webpack = {
    // Enzyme fix: https://github.com/airbnb/enzyme/issues/892#issuecomment-299660665
    externals: {
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true,
      'react-dom/test-utils': true,
      'react-test-renderer/shallow': true,
    },
    devtool: 'cheap-module-eval-source-map',
    resolve: {
      alias: {
        sinon: 'sinon/pkg/sinon.js',
      },
    },
    module: {
      noParse: [/sinon\.js/],
    },
  };
};
