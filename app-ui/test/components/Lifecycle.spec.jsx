import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import lifecycle from 'components/Lifecycle';

describe('(HOC) lifecycle', () => {
  const TestComponent = () => (<div>Test</div>);
  let componentWillMount;
  let componentDidMount;
  let componentWillUnmount;
  let Component;

  beforeEach(() => {
    Component = lifecycle(TestComponent);
    componentWillMount = sinon.spy();
    componentDidMount = sinon.spy();
    componentWillUnmount = sinon.spy();
  });

  it('Should render wrapped component', () => {
    const wrapper = shallow(<Component />).dive();

    expect(wrapper.html()).to.equal('<div>Test</div>');
  });

  it('Should call the componentWillMount prop before mount', () => {
    shallow(<Component componentWillMount={componentWillMount} />);

    componentWillMount.should.have.been.calledOnce();
  });

  it('Should call the componentDidMount prop after mount', () => {
    shallow(<Component componentDidMount={componentDidMount} />);

    componentDidMount.should.have.been.calledOnce();
  });

  it('Should call the componentWillUnmount prop after unmount', () => {
    const wrapper = shallow(<Component componentWillUnmount={componentWillUnmount} />);
    wrapper.unmount();

    componentWillUnmount.should.have.been.calledOnce();
  });
});
