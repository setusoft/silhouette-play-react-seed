import React from 'react';
import sinon from 'sinon';
import { i18n } from 'lingui-i18n';
import { Trans } from 'lingui-react';
import { shallow } from 'enzyme';
import { Link } from 'react-router';
import { Panel, Button } from 'react-bootstrap';
import { Form } from 'react-redux-form';
import { isRequired } from 'util/Validator';
import { modelPath } from 'routes/Auth/modules/SignUpModule';
import InputField from 'components/InputField';
import Spinner from 'components/Spinner';
import { SignUpComponent } from 'routes/Auth/components/SignUp/SignUp';
import isEmail from 'validator/lib/isEmail';
import config from 'config/index';

describe('(Component) Auth/SignUp', () => {
  let name;
  let email;
  let password;
  let isPending;
  let onSignUp;
  let $form;
  let wrapper;

  const getWrapper = () => shallow(
    <SignUpComponent
      name={name}
      email={email}
      password={password}
      isPending={isPending}
      i18n={i18n}
      onSignUp={onSignUp}
      $form={$form}
    />,
  );

  beforeEach(() => {
    name = 'John Doe';
    email = 'john@doe.com';
    isPending = true;
    onSignUp = sinon.spy();
    $form = { valid: true };
    wrapper = getWrapper();
  });

  it('Should contain a Panel', () => {
    expect(wrapper.find(Panel)).to.have.length(1);
  });

  it('Should contain a text paragraph with the link to the sign-in page', () => {
    expect(wrapper.contains(
      <p className="sign-in">
        <Trans>Already a member?</Trans> <Link to={config.route.auth.signIn}><Trans>Sign in now</Trans></Link>
      </p>,
    )).to.be.true();
  });

  it('Should contain a Button', () => {
    expect(wrapper.find(Button)).to.have.length(1);
  });

  describe('(Component) Panel', () => {
    it('Should have prop `className` set to "sign-up"', () => {
      expect(wrapper.find(Panel).get(0).props.className).to.equal('sign-up');
    });

    it('Should have prop `header` set to "Sign-Up"', () => {
      expect(wrapper.find(Panel).get(0).props.header).to.equal('Sign-Up');
    });
  });

  describe('(Component) Form', () => {
    it('Should have prop `model` set to the correct model path', () => {
      expect(wrapper.find(Form).get(0).props.model).to.equal(modelPath);
    });

    it('Should have prop `autoComplete` set to "off"', () => {
      expect(wrapper.find(Form).get(0).props.autoComplete).to.equal('off');
    });

    it('Should execute the `onSignUp` handler on submit', () => {
      wrapper.find(Form).simulate('submit');

      expect(onSignUp.callCount).to.equal(1);
    });

    describe('(Field) name', () => {
      it('Should be a `InputField`', () => {
        expect(wrapper.find('#name').find(InputField)).to.have.length(1);
      });

      it('Should be a text field', () => {
        expect(wrapper.find('#name').get(0).props.type).to.be.equal('text');
      });

      it('Should have a label set to "Name"', () => {
        expect(wrapper.find('#name').get(0).props.label).to.be.equal('Name');
      });

      it('Should have a maxLength set to 255', () => {
        expect(wrapper.find('#name').get(0).props.maxLength).to.be.equal('255');
      });

      it('Should have the correct validator set', () => {
        expect(wrapper.find('#name').get(0).props.validators).to.eql({
          isRequired,
        });
      });
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

    describe('(Field) password', () => {
      it('Should be a `InputField`', () => {
        expect(wrapper.find('#password').find(InputField)).to.have.length(1);
      });

      it('Should be a password field', () => {
        expect(wrapper.find('#password').get(0).props.type).to.be.equal('password');
      });

      it('Should have a label set to "Password"', () => {
        expect(wrapper.find('#password').get(0).props.label).to.be.equal('Password');
      });

      it('Should have a maxLength set to 255', () => {
        expect(wrapper.find('#password').get(0).props.maxLength).to.be.equal('255');
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
      expect(wrapper.find(Button).contains(<div><Spinner /> <Trans>Sign up</Trans></div>)).to.be.true();
    });

    it('Should not show the `Spinner` if `isPending` is set to false', () => {
      isPending = false;
      wrapper = getWrapper();

      expect(wrapper.find(Spinner)).to.have.length(0);
      expect(wrapper.find(Button).contains(<Trans>Sign up</Trans>)).to.be.true();
    });
  });
});
