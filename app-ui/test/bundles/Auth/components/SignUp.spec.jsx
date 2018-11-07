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
import { modelPath, signUpRequest } from 'bundles/Auth/modules/SignUpModule';
import FormControl from 'components/FormControl';
import { SignUpComponent } from 'bundles/Auth/components/SignUp/SignUp';
import isEmail from 'validator/lib/isEmail';
import config from 'config/index';
import { Request } from 'questrar';
import wrapRequest, { initialRequestState } from 'questrar-test';


describe('(Component) Auth/SignUp', () => {
  let requestId;
  let requestState;
  let onSignUp;
  let wrapper;

  const getWrapper = (valid = true) => shallow(
    <SignUpComponent
      form={{
        name: {},
        email: {},
        password: {},
        $form: { valid },
      }}
      i18n={i18n}
      onSignUp={onSignUp}
    />,
  );

  beforeEach(() => {
    requestId = signUpRequest.id;
    requestState = {
      ...initialRequestState,
      id: requestId,
    };
    onSignUp = sinon.spy();
    wrapper = getWrapper();
  });

  it('Should contain a Panel', () => {
    expect(wrapper.find(Panel)).to.have.length(1);
  });

  it('Should contain a text paragraph with the link to the sign-in page', () => {
    const paragraph = (
      <p className="sign-in">
        <Trans>
          Already a member?
        </Trans>
        {' '}
        <Link to={config.route.auth.signIn}>
          <Trans>
            Sign in now
          </Trans>
        </Link>
      </p>
    );

    expect(wrapper.contains(paragraph)).to.be.true();
  });

  it('Should contain a Button', () => {
    expect(wrapper.find(Button)).to.have.length(1);
  });

  describe('(Component) Panel', () => {
    it('Should have prop `className` set to "sign-up"', () => {
      expect(wrapper.find(Panel).get(0).props.className).to.equal('sign-up');
    });

    it('Should have Panel.Header set to "Sign-Up"', () => {
      expect(wrapper.find(Panel).contains(
        <Panel.Heading>
          <Trans>
            Sign-Up
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

        it('Should execute the `onSignUp` handler on submit', () => {
          wrapper.find(Form).simulate('submit');

          expect(onSignUp.callCount).to.equal(1);
        });

        describe('(Field) name', () => {
          it('Should be a `FormControl`', () => {
            expect(wrapper.find('#name').find(FormControl)).to.have.length(1);
          });

          it('Should have a label set to "Name"', () => {
            expect(wrapper.find('#name').get(0).props.label).to.be.equal('Name');
          });

          it('Should have the correct controlProps set', () => {
            expect(wrapper.find('#name').get(0).props.controlProps).to.eql({
              type: 'text',
              placeholder: 'Name',
              maxLength: 255,
            });
          });

          it('Should have the correct validator set', () => {
            expect(wrapper.find('#name').get(0).props.validators).to.eql({
              isRequired,
            });
          });
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

        it('Should wrap on sign-up `Button`', () => {
          wrapper = wrapRequest(node.dive())();

          expect(wrapper.is(Button)).to.be.true();
        });

        it('Should provide request state props to wrapped `Button`', () => {
          wrapper = wrapRequest(node.dive())(requestState);

          expect(wrapper.is(Button)).to.be.true();
          expect(wrapper.props().disabled).to.be.false();
          expect(wrapper.props().loading).to.be.false();

          requestState.pending = true;
          wrapper = wrapRequest(node.dive())(requestState);
          expect(wrapper.props().disabled).to.be.true();
          expect(wrapper.props().loading).to.be.true();
        });

        it('Should have `passivePending` prop set to true', () => {
          expect(node.props().passivePending).to.be.true();
        });

        it('Should have `inject` prop set to a function', () => {
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

        it('Should have prop `disabled` set to true if `$form.valid` is set to false', () => {
          const node = getWrapper(false).find(Request).dive();
          wrapper = wrapRequest(node)(requestState);

          expect(wrapper.props().disabled).to.equal(true);
        });
      });
    });
  });
});
