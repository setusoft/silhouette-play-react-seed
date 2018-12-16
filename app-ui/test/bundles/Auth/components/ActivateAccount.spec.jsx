import React from 'react';
import sinon from 'sinon';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react';
import { shallow } from 'enzyme';
import { Panel } from 'react-bootstrap';
import { Button } from 'components/Elements';
import { Request } from 'questrar';
import { ActivateAccountComponent } from 'bundles/Auth/components/ActivateAccount/ActivateAccount';
import { emailActivationRequest } from 'bundles/Auth/modules/ActivateAccountModule';
import wrapRequest, { initialRequestState } from 'questrar-test';

describe('(Component) Auth/ActivateAccount', () => {
  let requestId;
  let requestState;
  let email;
  let onSend;
  let wrapper;
  let onActivationSent;

  const getWrapper = () => shallow(
    <ActivateAccountComponent
      email={email}
      i18n={i18n}
      onSend={onSend}
      onActivationSent={onActivationSent}
    />,
  );

  beforeEach(() => {
    requestId = emailActivationRequest.id;
    requestState = {
      ...initialRequestState,
      id: requestId,
    };
    email = 'john@doe.com';
    onSend = sinon.spy();
    wrapper = getWrapper();
    onActivationSent = sinon.spy();
  });

  it('Should contain a Panel', () => {
    expect(wrapper.find(Panel)).to.have.length(1);
  });

  it('Should contain 4 text paragraphs', () => {
    expect(wrapper.find('p')).to.have.length(4);
  });

  it('Should contain the email address', () => {
    const paragraph = wrapper.find('p.email');

    expect(paragraph).to.have.length(1);
    expect(paragraph.text()).to.equal(email);
  });

  it('Should have a `Request` component on `Button`', () => {
    const request = wrapper.find(Request);

    expect(request).to.have.length(1);
    expect(request.children().first().is(Button)).to.be.true();
  });

  it('Should contain a Button', () => {
    expect(wrapper.find(Button)).to.have.length(1);
  });

  describe('(Component) Panel', () => {
    it('Should have prop `className` set to "activate-account"', () => {
      expect(wrapper.find(Panel).get(0).props.className).to.equal('activate-account');
    });

    it('Should have Panel.Header set to "Activate account"', () => {
      expect(wrapper.find(Panel).contains(
        <Panel.Heading>
          <Trans>
            Activate account
          </Trans>
        </Panel.Heading>,
      ));
    });

    describe('(Component) Panel.Body', () => {
      it('Should have prop `collapsible` set to false', () => {
        expect(wrapper.find(Panel.Body).get(0).props.collapsible).to.equal(false);
      });

      describe('(Component) Button', () => {
        it('Should have prop `bsStyle` set to "primary"', () => {
          expect(wrapper.find(Button).get(0).props.bsStyle).to.equal('primary');
        });

        it('Should have prop `type` set to "button"', () => {
          expect(wrapper.find(Button).get(0).props.type).to.equal('button');
        });

        it('Should have prop `block` set to true', () => {
          expect(wrapper.find(Button).get(0).props.block).to.equal(true);
        });

        xit('Should have prop `disabled` set to true if activation request is pending', () => {
          requestState.pending = true;
          const node = getWrapper().find(Request).dive();
          wrapper = wrapRequest(node)(requestState);

          expect(wrapper.is(Button)).to.be.true();
          expect(wrapper.props().disabled).to.equal(true);
        });

        it('Should execute the `onSend` handler on click', () => {
          wrapper.find(Button).simulate('click');

          expect(onSend.callCount).to.equal(1);
          expect(onSend.firstCall.args[0]).to.eql(email);
        });
      });

      describe('(Component) Request', () => {
        let node;

        beforeEach(() => {
          node = wrapper.find(Request).first();
        });

        it('Should track email activation request with id', () => {
          expect(node.props().id).to.be.equal(requestId);
        });

        xit('Should provide request state props to wrapped `Button`', () => {
          wrapper = wrapRequest(node)(requestState);
          expect(wrapper.is(Button)).to.be.true();
          expect(wrapper.props().loading).to.be.false();

          requestState.pending = true;
          wrapper = wrapRequest(node)(requestState);

          expect(wrapper.props().loading).to.be.true();
        });

        it('Should have `onSuccess` prop set', () => {
          expect(node.props().onSuccess).to.be.a('function');
        });

        it('Should have `onFailure` prop set', () => {
          expect(node.props().onFailure).to.be.a('function');
        });

        it('Should have `inject` prop set to a function', () => {
          expect(node.props().inject).to.be.a('function');
        });
      });
    });
  });
});
