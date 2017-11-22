import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import chaiEnzyme from 'chai-enzyme';
import dirtyChai from 'dirty-chai';
import shallowDeepEqual from 'chai-shallow-deep-equal';

configure({ adapter: new Adapter() });

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiEnzyme());
chai.use(dirtyChai);
chai.use(shallowDeepEqual);

global.chai = chai;
global.sinon = sinon;
global.expect = chai.expect;
global.should = chai.should();

// require all `test/**/*.spec.js|jsx`
const testsContext = require.context('./', true, /\.spec\.jsx?$/);
testsContext.keys().forEach(testsContext);
