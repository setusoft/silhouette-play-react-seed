import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import initializer from 'components/Initializer';

describe('(HOC) initializer', () => {
  const TestComponent = () => (<div>Test</div>);
  let onInit;
  let Component;

  beforeEach(() => {
    Component = initializer(TestComponent);
    onInit = sinon.spy();
  });

  it('Should render wrapped component', () => {
    const wrapper = shallow(<Component onInit={onInit} />);

    expect(wrapper.contains(
      <TestComponent />,
    )).to.be.true();
  });

  it('Should init the app before mount', () => {
    shallow(<Component onInit={onInit} />);

    onInit.should.have.been.calledOnce();
  });
});
