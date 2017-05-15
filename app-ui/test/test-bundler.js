// ---------------------------------------
// Test Environment Setup
// ---------------------------------------
import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import chaiEnzyme from 'chai-enzyme';
import dirtyChai from 'dirty-chai';
import shallowDeepEqual from 'chai-shallow-deep-equal';

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiEnzyme());
chai.use(dirtyChai);
chai.use(shallowDeepEqual);

global.chai = chai;
global.sinon = sinon;
global.expect = chai.expect;
global.should = chai.should();

// ---------------------------------------
// Require Tests
// ---------------------------------------
// for use with karma-webpack-with-fast-source-maps
const __karmaWebpackManifest__ = []; // eslint-disable-line
// eslint-disable-next-line no-bitwise
const inManifest = path => ~__karmaWebpackManifest__.indexOf(path);

// require all `test/**/*.spec.js|jsx`
const testsContext = require.context('./', true, /\.spec\.jsx?$/);

// only run tests that have changed after the first pass.
const testsToRun = testsContext.keys().filter(inManifest)
  ;(testsToRun.length ? testsToRun : testsContext.keys()).forEach(testsContext);
