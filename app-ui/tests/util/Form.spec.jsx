import React from 'react';
import { shallow } from 'enzyme';
import { HelpBlock } from 'react-bootstrap';
import { validationState, ErrorWrapper } from 'util/Form';

describe('(Util) Form', () => {
  describe('(Function) validationState', () => {
    it('Should be a function', () => {
      expect(validationState).to.be.a('function');
    });

    it('Should return null if the form is not touched', () => {
      expect(validationState({ touched: false })).to.be.null();
    });

    it('Should return "success" if the form is valid', () => {
      expect(validationState({ touched: true, valid: true })).to.equal('success');
    });

    it('Should return "error" if the form is not valid', () => {
      expect(validationState({ touched: true, valid: false })).to.equal('error');
    });
  });

  describe('(Function) errorWrapper', () => {
    it('Should be a function', () => {
      expect(ErrorWrapper).to.be.a('function');
    });

    it('Should render only the first error message', () => {
      const error1 = <p>Error1</p>;
      const error2 = <p>Error2</p>;
      const wrapper = shallow(<ErrorWrapper>{error1}{error2}</ErrorWrapper>);

      expect(wrapper.contains(
        <HelpBlock>
          {error1}
        </HelpBlock>
      )).to.be.true();
    });
  });
});
