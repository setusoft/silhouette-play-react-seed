import React from 'react';
import { shallow } from 'enzyme';
import Preloader from 'components/Preloader';

describe('(Component) Preloader', () => {
  let wrapper;

  it('Should render the preloader if the `preloaded` flag is set to false', () => {
    wrapper = shallow(<Preloader preloaded={false}><div /></Preloader>);

    const content = (
      <div className="preloader-wrapper">
        <div className="preloader" />
      </div>
    );

    expect(wrapper.contains(content)).to.be.true();
  });

  it('Should render the content if the `preloaded` flag is set to true', () => {
    wrapper = shallow(<Preloader preloaded><div /></Preloader>);

    expect(wrapper.contains(<div />)).to.be.true();
  });
});
