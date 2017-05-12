# Introduction

This application is based on the [React Redux Starter Kit](https://github.com/davezuko/react-redux-starter-kit).

# Changes

Here we list all changes which were made to the original starter kit to get it working with Play.

| Path                          | Changes                                  |
|-------------------------------|------------------------------------------|
| bin                           | No changes                               |
| config/environment.config.js  | Some custom changes                      |
| config/karma.config.js        | Some custom changes                      |
| config/project.config.js      | Some custom changes                      |
| config/webpack.config.js      | No changes                               |
| server                        | No changes                               |
| src/main.js                   | No changes                               |
| src/store/createStore.js      | Some custom changes                      |
| src/store/location.js         | No changes                               |
| src/store/reducers.js         | Some custom changes                      |
| tests/test-bundler.js         | Some custom changes                      |
| package.json                  | Changed                                  |

## Details

### config/environments.config.js

This parts were changed:
```
# development
# Use localhost instead of the IP address, otherwise we must use the
# IP address in the Content Security Policy, which doesn't work in
# multiple development environments.
compiler_public_path: `http://localhost:${config.server_port}/`,

# production
# Files will be served over the assets route in production.
compiler_public_path: '/assets/ui/',
```

### config/karma.config.js

This parts were changed:
```
// Include babel-polyfill to support ES6 Promises with fetch-mock 
files    : [
    'node_modules/babel-polyfill/dist/polyfill.js',
    ...
]

// Activate logging for tests
browserConsoleLogOptions: {
  level: 'log',
  format: '%b %T: %m',
  terminal: true
}
```

### config/project.config.js

This parts were changed:
```
# Deploys the files into the target directory, so that Play can package 
# them into the assets JAR file.
dir_dist   : path.resolve(__dirname, '../../target/npm/dist/ui'),
```

### store/createStore.js

This parts were changed:
```
# Use redux-promise-middleware
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const middleware = [thunk, sagaMiddleware];

sagaMiddleware.run(rootSaga);
```

### package.json

Here we list additional packages which are needed for the application:

- react-bootstrap
- react-icons
- react-s-alert
- react-redux-form
- redux-actions
- redux-auth-wrapper
- redux-saga
- flux-standard-action
- whatwg-fetch
- lodash
- js-cookie
- validator

Dev dependencies:

- babel-polyfill
- eslint-config-airbnb (https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)
- eslint-import-resolver-webpack
- eslint-plugin-jsx-a11y (needed by eslint-config-airbnb)
- eslint-plugin-import (needed by eslint-config-airbnb)
- eslint-plugin-flowtype
- flow-bin
- flow-typed
- dirty-chai (to fix lint errors)
- chai-shallow-deep-equal
- redux-saga-test-plan
- fetch-mock 
