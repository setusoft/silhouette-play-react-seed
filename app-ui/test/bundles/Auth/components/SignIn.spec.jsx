import React from 'react';
import sinon from 'sinon';
import { i18n } from 'lingui-i18n';
import { Trans } from 'lingui-react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import { Panel, Button } from 'react-bootstrap';
import { Form } from 'react-redux-form';
import { isRequired } from 'util/Validator';
import { modelPath } from 'bundles/Auth/modules/SignInModule';
import FormControl from 'components/FormControl';
import Spinner from 'components/Spinner';
import { SignInComponent } from 'bundles/Auth/components/SignIn/SignIn';
import isEmail from 'validator/lib/isEmail';
import config from 'config/index';

describe('(Component) Auth/SignIn', () => {
  let isPending;
  let onSignIn;
  let wrapper;

  const getWrapper = (valid = true) => shallow(<SignInComponent
    form={{
      email: {},
      password: {},
      $form: { valid },
    }}
    isPending={isPending}
    i18n={i18n}
    onSignIn={onSignIn}
  />);

  beforeEach(() => {
    isPending = true;
    onSignIn = sinon.spy();
    wrapper = getWrapper();
  });

  it('Should contain a Panel', () => {
    expect(wrapper.find(Panel)).to.have.length(1);
  });

  it('Should contain a text paragraph with the link to the password recovery page', () => {
    const paragraph = wrapper.find('p.password-recovery-link');
    const link = paragraph.find(Link);

    expect(paragraph).to.have.length(1);
    expect(link).to.have.length(1);

    expect(link.get(0).props.to).to.equal(config.route.auth.passwordRecovery);
    expect(link.contains(<Trans>Forgot your password?</Trans>)).to.be.true();
  });

  it('Should contain a Button', () => {
    expect(wrapper.find(Button)).to.have.length(1);
  });

  describe('(Component) Panel', () => {
    it('Should have prop `className` set to "sign-in"', () => {
      expect(wrapper.find(Panel).get(0).props.className).to.equal('sign-in');
    });

    it('Should have prop `header` set to "Sign-In"', () => {
      expect(wrapper.find(Panel).get(0).props.header).to.equal('Sign-In');
    });
  });

  describe('(Component) Form', () => {
    it('Should have prop `model` set to the correct model path', () => {
      expect(wrapper.find(Form).get(0).props.model).to.equal(modelPath);
    });

    it('Should have prop `autoComplete` set to "off"', () => {
      expect(wrapper.find(Form).get(0).props.autoComplete).to.equal('off');
    });

    it('Should execute the `onSignIn` handler on submit', () => {
      wrapper.find(Form).simulate('submit');

      expect(onSignIn.callCount).to.equal(1);
    });

    describe('(Field) email', () => {
      it('Should be a `FormControl`', () => {
        expect(wrapper.find('#email').find(FormControl)).to.have.length(1);
      });

      it('Should have a label set to "Email"', () => {
        expect(wrapper.find('#email').get(0).props.label).to.be.equal('Email');
      });

      it('Should have the correct controlProps set', () => {
        expect(wrapper.find('#email').get(0).props.controlProps).to.eql({
          type: 'email',
          placeholder: 'Email',
          maxLength: 255,
        });
      });

      it('Should have the correct validator set', () => {
        expect(wrapper.find('#email').get(0).props.validators).to.eql({
          isRequired,
          isEmail,
        });
      });
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
      wrapper = getWrapper(false);

      expect(wrapper.find(Button).get(0).props.disabled).to.equal(true);
    });

    it('Should have prop `disabled` set to true if `isPending` is set to true', () => {
      isPending = true;
      wrapper = getWrapper();

      expect(wrapper.find(Button).get(0).props.disabled).to.equal(true);
    });

    it('Should have prop `disabled` set to false if `$form.valid` is set to true and' +
      '`isPending` is set to false', () => {
      isPending = false;
      wrapper = getWrapper();

      expect(wrapper.find(Button).get(0).props.disabled).to.equal(false);
    });

    it('Should show the `Spinner` if `isPending` is set to true', () => {
      isPending = true;
      wrapper = getWrapper();

      expect(wrapper.find(Spinner)).to.have.length(1);
      expect(wrapper.find(Button).contains(<div><Spinner /> <Trans>Sign in</Trans></div>)).to.be.true();
    });

    it('Should not show the `Spinner` if `isPending` is set to false', () => {
      isPending = false;
      wrapper = getWrapper();

      expect(wrapper.find(Button).contains(<Trans>Sign in</Trans>)).to.be.true();
    });
  });
});
