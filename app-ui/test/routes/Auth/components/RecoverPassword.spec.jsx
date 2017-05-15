import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Panel, Button } from 'react-bootstrap';
import { Form } from 'react-redux-form';
import { isRequired } from 'util/Validator';
import { modelPath } from 'routes/Auth/modules/RecoverPasswordModule';
import InputField from 'components/InputField';
import Spinner from 'components/Spinner';
import RecoverPassword from 'routes/Auth/components/RecoverPassword';
import isEmail from 'validator/lib/isEmail';

describe('(Component) Auth/RecoverPassword', () => {
  let email;
  let isPending;
  let onSend;
  let $form;
  let wrapper;

  const getWrapper = () => shallow(
    <RecoverPassword
      email={email}
      isPending={isPending}
      onSend={onSend}
      $form={$form}
    />,
  );

  beforeEach(() => {
    email = 'john@doe.com';
    isPending = true;
    onSend = sinon.spy();
    $form = { valid: true };
    wrapper = getWrapper();
  });

  it('Should contain a Panel', () => {
    expect(wrapper.find(Panel)).to.have.length(1);
  });

  it('Should contain 1 text paragraphs', () => {
    expect(wrapper.find('p')).to.have.length(1);
  });

  it('Should contain a Button', () => {
    expect(wrapper.find(Button)).to.have.length(1);
  });

  describe('(Component) Panel', () => {
    it('Should have prop `className` set to "recover-password"', () => {
      expect(wrapper.find(Panel).get(0).props.className).to.equal('recover-password');
    });

    it('Should have prop `header` set to "Recover password"', () => {
      expect(wrapper.find(Panel).get(0).props.header).to.equal('Recover password');
    });
  });

  describe('(Component) Form', () => {
    it('Should have prop `model` set to the correct model path', () => {
      expect(wrapper.find(Form).get(0).props.model).to.equal(modelPath);
    });

    it('Should have prop `autoComplete` set to "off"', () => {
      expect(wrapper.find(Form).get(0).props.autoComplete).to.equal('off');
    });

    it('Should execute the `onSend` handler on submit', () => {
      wrapper.find(Form).simulate('submit');

      expect(onSend.callCount).to.equal(1);
    });

    describe('(Field) email', () => {
      it('Should be a `InputField`', () => {
        expect(wrapper.find('#email').find(InputField)).to.have.length(1);
      });

      it('Should be an email field', () => {
        expect(wrapper.find('#email').get(0).props.type).to.be.equal('email');
      });

      it('Should have a label set to "Email"', () => {
        expect(wrapper.find('#email').get(0).props.label).to.be.equal('Email');
      });

      it('Should have a maxLength set to 255', () => {
        expect(wrapper.find('#email').get(0).props.maxLength).to.be.equal('255');
      });

      it('Should have the correct validator set', () => {
        expect(wrapper.find('#email').get(0).props.validators).to.eql({
          isRequired,
          isEmail,
        });
      });
    });
  });

  describe('(Component) Button', () => {
    it('Should have prop `bsStyle` set to "primary"', () => {
      expect(wrapper.find(Button).get(0).props.bsStyle).to.equal('primary');
    });

    it('Should have prop `type` set to "submit"', () => {
      expect(wrapper.find(Button).get(0).props.type).to.equal('submit');
    });

    it('Should have prop `block` set to true', () => {
      expect(wrapper.find(Button).get(0).props.block).to.equal(true);
    });

    it('Should have prop `disabled` set to true if `$form.valid` is set to false', () => {
      isPending = false;
      $form = { valid: false };
      wrapper = getWrapper();

      expect(wrapper.find(Button).get(0).props.disabled).to.equal(true);
    });

    it('Should have prop `disabled` set to true if `isPending` is set to true', () => {
      isPending = true;
      $form = { valid: true };
      wrapper = getWrapper();

      expect(wrapper.find(Button).get(0).props.disabled).to.equal(true);
    });

    it('Should have prop `disabled` set to false if `$form.valid` is set to true and' +
      '`isPending` is set to false', () => {
      isPending = false;
      $form = { valid: true };
      wrapper = getWrapper();

      expect(wrapper.find(Button).get(0).props.disabled).to.equal(false);
    });

    it('Should show the `Spinner` if `isPending` is set to true', () => {
      isPending = true;
      wrapper = getWrapper();

      expect(wrapper.find(Spinner)).to.have.length(1);
      expect(wrapper.find(Button).children().text()).to.equal('<Spinner /> Send');
    });

    it('Should not show the `Spinner` if `isPending` is set to false', () => {
      isPending = false;
      wrapper = getWrapper();

      expect(wrapper.find(Spinner)).to.have.length(0);
      expect(wrapper.find(Button).children().text()).to.equal('Send');
    });
  });
});
