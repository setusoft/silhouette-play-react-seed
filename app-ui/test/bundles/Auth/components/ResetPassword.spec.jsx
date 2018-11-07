import React from 'react';
import sinon from 'sinon';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react';
import { shallow } from 'enzyme';
import { Panel } from 'react-bootstrap';
import { Button } from 'components/Elements';
import { Form } from 'react-redux-form';
import { isRequired } from 'util/Validator';
import { modelPath, resetPasswordRequest } from 'bundles/Auth/modules/ResetPasswordModule';
import FormControl from 'components/FormControl';
import { ResetPasswordComponent } from 'bundles/Auth/components/ResetPassword/ResetPassword';
import { Request } from 'questrar';
import wrapRequest, { initialRequestState } from 'questrar-test';

describe('(Component) Auth/ResetPassword', () => {
  let requestId;
  let requestState;
  const token = 'some-token';
  const password = 'some-password';
  let onReset;
  let wrapper;
  let onResetSuccess;
  let onResetFailure;

  const getWrapper = (valid = true) => shallow(
    <ResetPasswordComponent
      token={token}
      form={{
        password: {},
        $form: { valid },
      }}
      i18n={i18n}
      onReset={onReset}
      onResetFailure={onResetFailure}
      onResetSuccess={onResetSuccess}
    />,
  );

  beforeEach(() => {
    requestId = resetPasswordRequest.id;
    requestState = {
      ...initialRequestState,
      id: requestId,
    };
    onReset = sinon.spy();
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

    it('Should have Panel.Header set to "Reset password"', () => {
      expect(wrapper.find(Panel).contains(
        <Panel.Heading>
          <Trans>
            Reset password
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

        it('Should wrap reset password `Button`', () => {
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

        it('Should have `popoverOnFail` prop set to true', () => {
          expect(node.props().popoverOnFail).to.be.true();
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

        it('Should have prop `disabled` set to true if `$form.valid` is set to false', () => {
          const node = getWrapper(false).find(Request).dive();
          wrapper = wrapRequest(node)(requestState);

          expect(wrapper.props().disabled).to.equal(true);
        });
      });
    });
  });
});
