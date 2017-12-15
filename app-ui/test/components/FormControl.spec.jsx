import React from 'react';
import isEmpty from 'validator/lib/isEmpty';
import { i18n } from 'lingui-i18n';
import { shallow } from 'enzyme';
import { Control, Errors } from 'react-redux-form';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { validationState as defaultValidationState, ErrorWrapper } from 'util/Form';
import { FormControlComponent, defaultMessages } from 'components/FormControl/FormControl';

describe('(Component) FormControl', () => {
  const id = 'test';
  const formProps = { touched: true, valid: true };
  const validators = { isRequired: value => !isEmpty(String(value)) };
  const messages = { isCustom: 'A custom error' };
  const getWrapper = (props = {}) => {
    const component = (
      <FormControlComponent
        id={id}
        formProps={formProps}
        i18n={i18n}
        {...props}
      />
    );

    return shallow(component);
  };

  describe('(Component) FormGroup', () => {
    it('Should have prop `controlId` set to "test"', () => {
      expect(getWrapper().find(FormGroup).get(0).props.controlId).to.equal(id);
    });

    it('Should have prop `className` set to "custom-form-control"', () => {
      expect(getWrapper().find(FormGroup).get(0).props.className).to.equal('custom-form-control');
    });

    it('Should have prop `validationState` set to the given validation state', () => {
      const validationState = () => true;

      expect(getWrapper({ validationState })
        .find(FormGroup)
        .get(0).props.validationState)
        .to.equal(validationState());
    });

    it('Should have prop `validationState` set to the default validation state', () => {
      expect(getWrapper({ defaultValidationState })
        .find(FormGroup)
        .get(0).props.validationState)
        .to.equal(defaultValidationState(formProps));
    });

    describe('(Component) ControlLabel', () => {
      it('Should contain a label if the label was set', () => {
        expect(getWrapper({ label: 'Email' }).find(ControlLabel).children().text()).to.equal('Email');
      });

      it('Should not contain a label if the label was not set', () => {
        expect(getWrapper().find(ControlLabel)).to.have.length(0);
      });
    });

    describe('(Component) help block', () => {
      it('Should contain a help block if the help was set', () => {
        const help = 'Some description';
        expect(getWrapper({ help }).find('.help').children().text()).to.equal(help);
      });

      it('Should not contain a help block if the help was not set', () => {
        expect(getWrapper().find('.help')).to.have.length(0);
      });
    });

    describe('(Component) Control', () => {
      it('Should have prop `model` set to ".test"', () => {
        expect(getWrapper().find(Control).get(0).props.model).to.equal(`.${id}`);
      });

      it('Should have prop `controlProps` set to the control props', () => {
        const controlProps = { type: 'email' };

        expect(getWrapper({ controlProps }).find(Control).get(0).props.controlProps).to.equal(controlProps);
      });

      it('Should have prop `component` set to `FormControl`', () => {
        expect(getWrapper().find(Control).get(0).props.component).to.equal(FormControl);
      });

      it('Should have prop `autoComplete` set to "off"', () => {
        expect(getWrapper().find(Control).get(0).props.autoComplete).to.equal('off');
      });

      it('Should have prop `validators` set to the list of validators', () => {
        expect(getWrapper({ validators }).find(Control).get(0).props.validators).to.eql(validators);
      });
    });

    it('Should contain the FormControl.Feedback', () => {
      expect(getWrapper().find(FormControl.Feedback)).to.have.length(1);
    });

    describe('(Component) Errors', () => {
      it('Should have prop `model` set to ".test"', () => {
        expect(getWrapper().find(Errors).get(0).props.model).to.equal(`.${id}`);
      });

      it('Should have prop `show` set to "touched"', () => {
        expect(getWrapper().find(Errors).get(0).props.show).to.equal('touched');
      });

      it('Should have prop `wrapper` set to `ErrorWrapper`', () => {
        expect(getWrapper().find(Errors).get(0).props.wrapper).to.equal(ErrorWrapper);
      });

      it('Should have prop `messages` set to the list of messages', () => {
        expect(getWrapper({ messages }).find(Errors).get(0).props.messages).to.eql({
          ...defaultMessages(i18n),
          ...messages,
        });
      });
    });
  });
});
