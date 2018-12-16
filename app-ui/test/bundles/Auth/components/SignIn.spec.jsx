import React from 'react';
import sinon from 'sinon';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import { Panel } from 'react-bootstrap';
import { Button } from 'components/Elements';
import { Form } from 'react-redux-form';
import { isRequired } from 'util/Validator';
import { modelPath, signInRequest } from 'bundles/Auth/modules/SignInModule';
import FormControl from 'components/FormControl';
import { SignInComponent } from 'bundles/Auth/components/SignIn/SignIn';
import isEmail from 'validator/lib/isEmail';
import config from 'config/index';
import { Request } from 'questrar';
import wrapRequest, { initialRequestState } from 'questrar-test';

describe('(Component) Auth/SignIn', () => {
  let requestId;
  let requestState;
  let onSignIn;
  let wrapper;

  const getWrapper = (valid = true) => shallow(
    <SignInComponent
      form={{
        email: {},
        password: {},
        $form: { valid },
      }}
      i18n={i18n}
      onSignIn={onSignIn}
    />,
  );

  beforeEach(() => {
    requestId = signInRequest.id;
    requestState = {
      ...initialRequestState,
      id: requestId,
    };
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
    expect(link.contains(
      <Trans>
        Forgot your password?
      </Trans>,
    )).to.be.true();
  });

  it('Should contain a Button', () => {
    expect(wrapper.find(Button)).to.have.length(1);
  });

  describe('(Component) Panel', () => {
    it('Should have prop `className` set to "sign-in"', () => {
      expect(wrapper.find(Panel).get(0).props.className).to.equal('sign-in');
    });

    it('Should have Panel.Header set to "Sign-In"', () => {
      expect(wrapper.find(Panel).contains(
        <Panel.Heading>
          <Trans>
            Sign-In
          </Trans>
        </Panel.Heading>,
      ));
    });

    describe('(Component) Panel.Body', () => {
      it('Should have prop `collapsible` set to false', () => {
        expect(wrapper.find(Panel.Body).get(0).props.collapsible).to.equal(false);
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


      describe('(Component) Request', () => {
        let node;

        beforeEach(() => {
          node = wrapper.find(Request);
        });

        it('Should track recover password request with id', () => {
          expect(node.props().id).to.be.equal(requestId);
        });

        it('Should wrap on sign-in `Button`', () => {
          expect(node.children().is(Button)).to.be.true();
        });

        xit('Should provide request state props to wrapped `Button`', () => {
          wrapper = wrapRequest(node.dive())(requestState);

          expect(wrapper.is(Button)).to.be.true();
          expect(wrapper.props().disabled).to.be.false();
          expect(wrapper.props().loading).to.be.false();

          requestState.pending = true;
          wrapper = wrapRequest(node.dive())(requestState);
          expect(wrapper.props().disabled).to.be.true();
          expect(wrapper.props().loading).to.be.true();
        });

        it('Should have `onFailure` prop set', () => {
          expect(node.props().onFailure).to.be.a('function');
        });

        it('Should have `inject` prop set as a function', () => {
          expect(node.props().inject).to.be.a('function');
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

        xit('Should have prop `disabled` set to true if `$form.valid` is set to false', () => {
          const node = getWrapper(false).find(Request).dive();
          wrapper = wrapRequest(node)({ ...initialRequestState, id: requestId });

          expect(wrapper.props().disabled).to.equal(true);
        });
      });
    });
  });
});
