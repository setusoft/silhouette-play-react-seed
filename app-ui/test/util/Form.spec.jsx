import React from 'react';
import { shallow } from 'enzyme';
import { HelpBlock } from 'react-bootstrap';
import { showErrors, ErrorWrapper } from 'util/Form';

describe('(Util) Form', () => {
  describe('(Function) showErrors', () => {
    it('Should be a function', () => {
      expect(showErrors).to.be.a('function');
    });

    it('Should return `false` if the form is touched and valid', () => {
      expect(showErrors({ touched: true, valid: true })).to.be.false();
    });

    it('Should return `false` if the form is submitted and valid', () => {
      expect(showErrors({ submitted: true, valid: true })).to.be.false();
    });

    it('Should return `true` if the form is touched and not valid', () => {
      expect(showErrors({ touched: true, valid: false })).to.be.true();
    });

    it('Should return `true` if the form is submitted and not valid', () => {
      expect(showErrors({ touched: true, valid: false })).to.be.true();
    });

    it('Should handle nested forms', () => {
      expect(showErrors({ $form: { touched: true, valid: false } })).to.be.true();
    });
  });

  describe('(Function) errorWrapper', () => {
    it('Should be a function', () => {
      expect(ErrorWrapper).to.be.a('function');
    });

    it('Should render only the first error message', () => {
      const error1 = (
        <p>
          Error1
        </p>
      );
      const error2 = (
        <p>
          Error2
        </p>
      );
      const wrapper = shallow(
        <ErrorWrapper>
          {error1}
          {error2}
        </ErrorWrapper>,
      );
      const helpBlock = (
        <HelpBlock>
          {error1}
        </HelpBlock>
      );

      expect(wrapper.contains(helpBlock)).to.be.true();
    });
  });
});
