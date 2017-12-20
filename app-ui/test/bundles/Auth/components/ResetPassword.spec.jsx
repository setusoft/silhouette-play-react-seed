import React from 'react';
import sinon from 'sinon';
import { i18n } from 'lingui-i18n';
import { Trans } from 'lingui-react';
import { shallow } from 'enzyme';
import { Panel, Button } from 'react-bootstrap';
import { Form } from 'react-redux-form';
import { isRequired } from 'util/Validator';
import { modelPath } from 'bundles/Auth/modules/ResetPasswordModule';
import FormControl from 'components/FormControl';
import Spinner from 'components/Spinner';
import { ResetPasswordComponent } from 'bundles/Auth/components/ResetPassword/ResetPassword';

describe('(Component) Auth/ResetPassword', () => {
  let token;
  let password;
  let isPending;
  let onReset;
  let $form;
  let wrapper;

  const getWrapper = () => shallow(<ResetPasswordComponent
    token={token}
    password={password}
    isPending={isPending}
    i18n={i18n}
    onReset={onReset}
    $form={$form}
  />);

  beforeEach(() => {
    token = 'some-token';
    password = 'some-password';
    isPending = true;
    onReset = sinon.spy();
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
    it('Should have prop `className` set to "reset-password"', () => {
      expect(wrapper.find(Panel).get(0).props.className).to.equal('reset-password');
    });

    it('Should have prop `header` set to "Reset password"', () => {
      expect(wrapper.find(Panel).get(0).props.header).to.equal('Reset password');
    });
  });

  describe('(Component) Form', () => {
    it('Should have prop `model` set to the correct model path', () => {
      expect(wrapper.find(Form).get(0).props.model).to.equal(modelPath);
    });

    it('Should have prop `autoComplete` set to "off"', () => {
      expect(wrapper.find(Form).get(0).props.autoComplete).to.equal('off');
    });

    it('Should execute the `onReset` handler on submit', () => {
      wrapper.find(Form).simulate('submit', { password });

      expect(onReset.callCount).to.equal(1);
      expect(onReset.firstCall.args[0]).to.equal(token);
      expect(onReset.firstCall.args[1]).to.eql({ password });
    });

    describe('(Field) password', () => {
      it('Should be a `FormControl`', () => {
        expect(wrapper.find('#password').find(FormControl)).to.have.length(1);
      });

      it('Should have a label set to "Password"', () => {
        expect(wrapper.find('#password').get(0).props.label).to.be.equal('Password');
      });

      it('Should have the correct controlProps set', () => {
        expect(wrapper.find('#password').get(0).props.controlProps).to.eql({
          type: 'password',
          placeholder: 'Password',
          maxLength: 255,
        });
      });

      it('Should have the correct validator set', () => {
        expect(wrapper.find('#password').get(0).props.validators).to.eql({
          isRequired,
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
      expect(wrapper.find(Button).contains(<div><Spinner /> <Trans>Reset</Trans></div>)).to.be.true();
    });

    it('Should not show the `Spinner` if `isPending` is set to false', () => {
      isPending = false;
      wrapper = getWrapper();

      expect(wrapper.find(Spinner)).to.have.length(0);
      expect(wrapper.find(Button).contains(<Trans>Reset</Trans>)).to.be.true();
    });
  });
});
