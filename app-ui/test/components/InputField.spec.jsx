import React from 'react';
import i18n from 'lingui-i18n';
import { shallow } from 'enzyme';
import { Control, Errors } from 'react-redux-form';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { validationState, ErrorWrapper } from 'util/Form';
import { isRequired } from 'util/Validator';
import { InputFieldComponent, defaultMessages } from 'components/InputField/InputField';

describe('(Component) InputField', () => {
  const id = 'test';
  const type = 'email';
  const label = 'Email';
  const formProps = { touched: true, valid: true };
  const validators = { isRequired };
  const messages = { isCustom: 'A custom error' };
  const maxLength = 255;
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<InputFieldComponent
      id={id}
      type={type}
      label={label}
      formProps={formProps}
      validators={validators}
      messages={messages}
      maxLength={maxLength}
      i18n={i18n}
    />);
  });

  describe('(Component) FormGroup', () => {
    it('Should have prop `controlId` set to "test"', () => {
      expect(wrapper.find(FormGroup).get(0).props.controlId).to.equal(id);
    });

    it('Should have prop `className` set to "input-field"', () => {
      expect(wrapper.find(FormGroup).get(0).props.className).to.equal('input-field');
    });

    it('Should have prop `validationState` set to the correct validation state', () => {
      expect(wrapper.find(FormGroup).get(0).props.validationState).to.equal(validationState(formProps));
    });

    describe('(Component) ControlLabel', () => {
      it('Should contain the label "Email"', () => {
        expect(wrapper.find(ControlLabel).children().text()).to.equal(label);
      });
    });

    describe('(Component) Control', () => {
      it('Should have prop `model` set to ".test"', () => {
        expect(wrapper.find(Control).get(0).props.model).to.equal(`.${id}`);
      });

      it('Should have prop `type` set to "email"', () => {
        expect(wrapper.find(Control).get(0).props.type).to.equal(type);
      });

      it('Should have prop `placeholder` set to "Email"', () => {
        expect(wrapper.find(Control).get(0).props.placeholder).to.equal(label);
      });

      it('Should have prop `component` set to `FormControl`', () => {
        expect(wrapper.find(Control).get(0).props.component).to.equal(FormControl);
      });

      it('Should have prop `autoComplete` set to "off"', () => {
        expect(wrapper.find(Control).get(0).props.autoComplete).to.equal('off');
      });

      it('Should have prop `validators` set to the list of validators', () => {
        expect(wrapper.find(Control).get(0).props.validators).to.eql(validators);
      });

      it('Should have prop `maxLength` set to 255', () => {
        expect(wrapper.find(Control).get(0).props.maxLength).to.equal(maxLength);
      });
    });

    it('Should contain the FormControl.Feedback', () => {
      expect(wrapper.find(FormControl.Feedback)).to.have.length(1);
    });

    describe('(Component) Errors', () => {
      it('Should have prop `model` set to ".test"', () => {
        expect(wrapper.find(Errors).get(0).props.model).to.equal(`.${id}`);
      });

      it('Should have prop `show` set to "touched"', () => {
        expect(wrapper.find(Errors).get(0).props.show).to.equal('touched');
      });

      it('Should have prop `wrapper` set to `ErrorWrapper`', () => {
        expect(wrapper.find(Errors).get(0).props.wrapper).to.equal(ErrorWrapper);
      });

      it('Should have prop `messages` set to the list of messages', () => {
        expect(wrapper.find(Errors).get(0).props.messages).to.eql({
          ...defaultMessages(i18n),
          ...messages,
        });
      });
    });
  });
});
