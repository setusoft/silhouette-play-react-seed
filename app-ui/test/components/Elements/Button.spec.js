import React from 'react';
import { Button } from "components/Elements";
import { shallow } from 'enzyme';
import Spinner from 'components/Spinner';
import { Button as BsButton } from "react-bootstrap";

describe('(Component) Button', () => {
  let loading;
  let disabled;
  let bsStyle;
  let content;
  let block;
  let wrapper;
  let onClick;

  let getWrapper = () => shallow(
    <Button
      loading={loading}
      disabled={disabled}
      bsStyle={bsStyle}
      block={block}
    >
      {content}
    </Button>
  );

  beforeEach(() => {
    content = "Boot Button";
    loading = false;
    disabled = false;
    bsStyle = "primary";
    block = true;
    onClick = sinon.spy();
    wrapper = getWrapper();
  });

  it('Should render a `BsButton`', () => {
    expect(wrapper.first().is(BsButton)).to.be.true();
  });

  it('Should have a loading prop', () => {
    loading = true;
    wrapper = getWrapper();
    expect(wrapper.props().loading).to.be.true();
  });

  it('Should be able to set `block` prop', () => {
    expect(wrapper.props().block).to.be.true();
  });

  it('Should have `bsStyle` prop set on `BsButton`', () => {
    expect(wrapper.first().props().bsStyle).to.be.equal(bsStyle);
  });

  it('Should show a `Spinner` on loading', () => {
    loading = true;
    wrapper = getWrapper();
    expect(wrapper.find(Spinner)).to.have.lengthOf(1);
  });

  it('Should have no `Spinner` when loading set to false', () => {
    loading = false;
    wrapper = getWrapper();
    expect(wrapper.find(Spinner)).to.have.lengthOf(0);
    expect(wrapper.children()).to.be.eql(content)
  });

  it('Should be disabled on disabled set to true', () => {
    disabled = true;
    wrapper = getWrapper();
    expect(wrapper.props().disabled).to.be.true();
  });

  it('Should execute the `onClick` handler on click', () => {
    wrapper = getWrapper();
    wrapper.simulate('click');

    expect(onClick.callCount).to.equal(1);
  });


});
