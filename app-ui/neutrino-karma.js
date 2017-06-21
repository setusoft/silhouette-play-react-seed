const { join } = require('path');

module.exports = {
  use: [
    (neutrino) => {
      const tests = join(neutrino.options.tests, '**/test-bundler.js');

      neutrino.use('neutrino-preset-karma', {
        override: true,
        browsers: [process.env.CI ? 'ChromeCI' : 'Chrome'],
        customLaunchers: {
          ChromeCI: {
            base: 'Chrome',
            flags: ['--no-sandbox'],
          },
        },
        frameworks: ['mocha'],
        // Include babel-polyfill to support ES6 Promises with fetch-mock
        files: ['node_modules/babel-polyfill/dist/polyfill.js', tests],
        plugins: [
          require.resolve('karma-webpack'),
          require.resolve('karma-chrome-launcher'),
          require.resolve('karma-sourcemap-loader'),
          require.resolve('karma-coverage'),
          require.resolve('karma-mocha'),
          require.resolve('karma-mocha-reporter'),
        ],
        preprocessors: {
          [tests]: ['webpack', 'sourcemap'],
        },
        webpackMiddleware: { noInfo: true },
        reporters: ['mocha', 'coverage'],
        coverageReporter: {
          dir: '.coverage',
          reporters: [
            { type: 'text-summary' },
            { type: 'html', subdir: 'report-html' },
            { type: 'lcov', subdir: 'report-lcov' },
          ],
        },
        // Activate logging for tests
        browserConsoleLogOptions: {
          level: 'log',
          format: '%b %T: %m',
          terminal: true,
        },
        webpack: {
          // Enzyme fix: https://github.com/airbnb/enzyme/issues/892#issuecomment-299660665
          externals: {
            'react/addons': true,
            'react/lib/ExecutionEnvironment': true,
            'react/lib/ReactContext': true,
            'react-dom/test-utils': true,
            'react-test-renderer/shallow': true,
          },
          devtool: 'inline-source-map',
          resolve: {
            alias: {
              sinon: 'sinon/pkg/sinon.js',
            },
          },
          module: {
            noParse: [/sinon\.js/],
          },
        },
      });
    },
  ],
};
