import React from 'react';
import isEmpty from 'validator/lib/isEmpty';
import { i18n } from '@lingui/core';
import { shallow } from 'enzyme';
import { Control, Errors } from 'react-redux-form';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { ErrorWrapper } from 'util/Form';
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
    it('Should have prop `controlId` set to "custom-form-control-test"', () => {
      expect(getWrapper().find(FormGroup).get(0).props.controlId).to.equal(`custom-form-control-${id}`);
    });

    it('Should have prop `className` set to "custom-form-control" and the ID', () => {
      expect(getWrapper().find(FormGroup).get(0).props.className).to.equal(`custom-form-control ${id}`);
    });

    it('Should have prop `validationState` set to `error` if the given show error function returns `true`', () => {
      const showErrors = () => true;

      expect(getWrapper({ showErrors })
        .find(FormGroup)
        .get(0).props.validationState)
        .to.equal('error');
    });

    it('Should have prop `validationState` set to `null` if the given show error function returns `false`', () => {
      const showErrors = () => false;

      expect(getWrapper({ showErrors })
        .find(FormGroup)
        .get(0).props.validationState)
        .to.equal(null);
    });

    it('Should have prop `validationState` set to `error` if the default show error function returns `true`', () => {
      expect(getWrapper({ formProps: { valid: false, touched: true } })
        .find(FormGroup)
        .get(0).props.validationState)
        .to.equal('error');
    });

    it('Should have prop `validationState` set to `null` if the default show error function returns `false`', () => {
      expect(getWrapper({ formProps: { valid: true, touched: true } })
        .find(FormGroup)
        .get(0).props.validationState)
        .to.equal(null);
    });

    describe('(Prop) label', () => {
      it('Should contain a label if the `label` prop was set', () => {
        expect(getWrapper({ label: 'Email' }).find(ControlLabel).children().text()).to.equal('Email');
      });

      it('Should not contain a label if the `label` prop was not set', () => {
        expect(getWrapper().find(ControlLabel)).to.have.length(0);
      });
    });

    describe('(Prop) optional', () => {
      it('Should contain an optional indicator if the `optional` prop was set to `true`', () => {
        expect(getWrapper({ optional: true }).find('.optional').children().text()).to.equal('(Optional)');
      });

      it('Should not contain an optional indicator if the `optional` prop was not set', () => {
        expect(getWrapper().find('.optional')).to.have.length(0);
      });
    });

    describe('(Prop) help', () => {
      it('Should contain a help block if the `help` prop was set', () => {
        const help = 'Some description';
        expect(getWrapper({ help }).find('.help').children().text()).to.equal(help);
      });

      it('Should not contain a help block if the `help` prop was not set', () => {
        expect(getWrapper().find('.help')).to.have.length(0);
      });
    });

    describe('(Component) Control', () => {
      it('Should have prop `model` set to the ID if the `model` prop was not set', () => {
        expect(getWrapper().find(Control).get(0).props.model).to.equal(`.${id}`);
      });

      it('Should have prop `model` set to the the `model` prop', () => {
        expect(getWrapper({ model: 'model-test' }).find(Control).get(0).props.model).to.equal('.model-test');
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

    it('Should contain the FormControl.Feedback component if the `feedback` prop is set to true', () => {
      expect(getWrapper({ feedback: true }).find(FormControl.Feedback)).to.have.length(1);
    });

    it('Should not contain the FormControl.Feedback component if the `feedback` prop is set to false', () => {
      expect(getWrapper({ feedback: false }).find(FormControl.Feedback)).to.have.length(0);
    });

    describe('(Component) Errors', () => {
      it('Should have prop `model` set to ".test"', () => {
        expect(getWrapper().find(Errors).get(0).props.model).to.equal(`.${id}`);
      });

      it('Should have prop `show` set to the result of the `showErrors` function', () => {
        const showErrors = () => true;

        expect(getWrapper({ showErrors })
          .find(Errors)
          .get(0).props.show)
          .to.equal(showErrors());
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
