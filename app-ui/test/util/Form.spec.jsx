import React from 'react';
import { shallow } from 'enzyme';
import { HelpBlock, OverlayTrigger } from 'react-bootstrap';
import {
  showErrors, ErrorWrapper, popoverOnFailure, popoverOnSuccess, popoverOnChild,
} from 'util/Form';

const ChildEl = () => (
  <div className="child">
    child
  </div>
);

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

  describe('(Function) popoverOnChild', () => {
    let requestProp;
    let child;
    let options;
    let popover;

    const createPopover = () => {
      popover = (
        <div>
          {popoverOnChild(requestProp, child, options)}
        </div>
      );
    };

    beforeEach(() => {
      requestProp = {
        data: {
          id: 'id1234',
          failed: false,
          success: false,
          message: 'some message',
        },
      };
      child = <ChildEl />;
      options = {};
    });

    it('Should render a popover on child element provided as argument', () => {
      createPopover();
      const wrapper = shallow(popover);

      expect(React.isValidElement(popover)).to.be.true();
      expect(wrapper.children().is(OverlayTrigger)).to.be.true();
      expect(wrapper.find(OverlayTrigger).children().is(ChildEl));
    });

    it('Should render overlay with cursor as pointer if onClick is set as a function', () => {
      options.onClick = () => {};
      createPopover();
      const overlayWrapper = shallow(shallow(popover).children().first().props().overlay);

      expect(overlayWrapper.props().style).to.be.an('object').that.includes({ cursor: 'pointer' });
    });

    it('Should not render overlay with cursor as pointer if onClick is not set as a function', () => {
      createPopover();
      const overlayWrapper = shallow(shallow(popover).children().first().props().overlay);

      expect(overlayWrapper.props().style).to.be.an('object').that.does.not.includes({ cursor: 'pointer' });
    });
  });

  describe('(Function) popoverOnFailure', () => {
    let requestProp;
    let child;
    let options;
    let wrapper;

    const createFailedPopover = () => {
      wrapper = shallow(
        <div>
          {popoverOnFailure(options)(requestProp, child)}
        </div>,
      );
    };

    beforeEach(() => {
      requestProp = {
        data: {
          id: 'id1234',
          failed: false,
          success: false,
          message: 'some message',
        },
      };
      child = <ChildEl />;
      options = {
        onClick: () => {},
      };
    });

    it('Should render a popover only if request failed', () => {
      requestProp.data.failed = true;
      createFailedPopover();

      expect(wrapper.children().is(OverlayTrigger)).to.be.true();
    });

    it('Should not render a popover only if request has not failed', () => {
      requestProp.data.success = true;
      createFailedPopover();

      expect(wrapper.children().is(ChildEl)).to.be.true();
    });

    it('Should not render a popover if request has no message', () => {
      requestProp.data.failed = true;
      requestProp.data.message = undefined;
      createFailedPopover();

      expect(wrapper.children().is(ChildEl)).to.be.true();
    });
  });

  describe('(Function) popoverOnSuccess', () => {
    let requestProp;
    let child;
    let options;
    let wrapper;

    const createSuccessPopover = () => {
      wrapper = shallow(
        <div>
          {popoverOnSuccess(options)(requestProp, child)}
        </div>,
      );
    };

    beforeEach(() => {
      requestProp = {
        data: {
          id: 'id1234',
          failed: false,
          success: false,
          message: 'some message',
        },
      };
      child = <ChildEl />;

      options = {
        onClick: () => {},
      };
    });

    it('Should render a popover only if request is successful', () => {
      requestProp.data.success = true;
      createSuccessPopover();

      expect(wrapper.children().is(OverlayTrigger)).to.be.true();
    });

    it('Should not render a popover if request is failed', () => {
      requestProp.data.failed = true;
      createSuccessPopover();

      expect(wrapper.children().is(ChildEl)).to.be.true();
    });

    it('Should not render a popover if request has no message', () => {
      requestProp.data.success = true;
      requestProp.data.message = undefined;
      createSuccessPopover();

      expect(wrapper.children().is(ChildEl)).to.be.true();
    });
  });
});
