import React from 'react';
import { shallow } from 'enzyme';
import Spinner from 'components/Spinner';

describe('(Component) Spinner', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Spinner />);
  });

  it('Should contain a wrapper div with class name "spinner"', () => {
    expect(wrapper.find('div.spinner')).to.have.length(1);
  });

  describe('Wrapper div', () => {
    it('Should contain 12 div elements', () => {
      const spinner = wrapper.find('div.spinner');

      expect(spinner.children()).to.have.length(12);
      expect(spinner.childAt(0).contains(<div className="spinner-circle1 spinner-circle" />)).to.be.true();
      expect(spinner.childAt(1).contains(<div className="spinner-circle2 spinner-circle" />)).to.be.true();
      expect(spinner.childAt(2).contains(<div className="spinner-circle3 spinner-circle" />)).to.be.true();
      expect(spinner.childAt(3).contains(<div className="spinner-circle4 spinner-circle" />)).to.be.true();
      expect(spinner.childAt(4).contains(<div className="spinner-circle5 spinner-circle" />)).to.be.true();
      expect(spinner.childAt(5).contains(<div className="spinner-circle6 spinner-circle" />)).to.be.true();
      expect(spinner.childAt(6).contains(<div className="spinner-circle7 spinner-circle" />)).to.be.true();
      expect(spinner.childAt(7).contains(<div className="spinner-circle8 spinner-circle" />)).to.be.true();
      expect(spinner.childAt(8).contains(<div className="spinner-circle9 spinner-circle" />)).to.be.true();
      expect(spinner.childAt(9).contains(<div className="spinner-circle10 spinner-circle" />)).to.be.true();
      expect(spinner.childAt(10).contains(<div className="spinner-circle11 spinner-circle" />)).to.be.true();
      expect(spinner.childAt(11).contains(<div className="spinner-circle12 spinner-circle" />)).to.be.true();
    });
  });
});
