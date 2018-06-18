import React from 'react';
import { shallow } from 'enzyme';
import Preloader from 'components/Preloader';

describe('(Component) Preloader', () => {
  const wrapper = ({ preloaded = false, children } = {}) =>
    shallow(<Preloader preloaded={preloaded}>{children}</Preloader>);

  it('Should render the preloader if the `preloaded` flag is set to false', () => {
    const children = (
      <div className="preloader-wrapper">
        <div className="preloader" />
      </div>
    );

    expect(wrapper({ preloaded: false, children }).contains(children)).to.be.true();
  });

  it('Should render the content if the `preloaded` flag is set to true', () => {
    const children = <div />;

    expect(wrapper({ preloaded: true, children }).contains(children)).to.be.true();
  });
});
