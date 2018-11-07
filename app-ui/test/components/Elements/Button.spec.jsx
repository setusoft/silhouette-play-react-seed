import React from 'react';
import { Button } from 'components/Elements';
import { shallow } from 'enzyme';
import Spinner from 'components/Spinner';
import { Button as BsButton } from 'react-bootstrap';

describe('(Component) Elements/Button', () => {
  let loading;
  let disabled;
  let bsStyle;
  let content;
  let block;
  let wrapper;
  let onClick;

  const createWrapper = () => {
    wrapper = shallow(
      <Button
        loading={loading}
        disabled={disabled}
        bsStyle={bsStyle}
        block={block}
        onClick={onClick}
      >
        {content}
      </Button>,
    );
  };

  beforeEach(() => {
    content = 'Boot Button';
    loading = false;
    disabled = false;
    bsStyle = 'primary';
    block = true;
    onClick = sinon.spy();
    createWrapper();
  });

  it('Should render a `BsButton`', () => {
    expect(wrapper.first().is(BsButton)).to.be.true();
  });

  it('Should be able to set `block` prop as boolean', () => {
    expect(wrapper.props().block).to.be.equal(true);
  });

  it('Should have `bsStyle` prop set on `BsButton`', () => {
    expect(wrapper.first().props().bsStyle).to.be.equal(bsStyle);
  });

  it('Should show a `Spinner` on loading', () => {
    loading = true;
    createWrapper();
    expect(wrapper.find(Spinner)).to.have.lengthOf(1);
  });

  it('Should have no `Spinner` when loading set to false', () => {
    loading = false;
    createWrapper();

    expect(wrapper.find(Spinner)).to.be.empty();
  });

  it('Should be disabled on disabled set to true', () => {
    disabled = true;
    createWrapper();
    expect(wrapper.props().disabled).to.be.true();
  });

  it('Should execute the `onClick` handler on click', () => {
    createWrapper();
    wrapper.simulate('click');

    expect(onClick.callCount).to.equal(1);
  });
});
