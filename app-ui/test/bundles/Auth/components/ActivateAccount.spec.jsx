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

describe('(Component) Auth/ActivateAccount', () => {
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
    email = 'john@doe.com';
    onSend = sinon.spy();
    wrapper = getWrapper();
    onActivationSent = sinon.spy()
  });

  it('Should contain a Panel', () => {
    expect(wrapper.find(Panel)).to.have.length(1);
  });

  it('Should have a `Request` component on `Button`', () => {
    const request = wrapper.find(Request);
    expect(request).to.have.length(1);
    expect(request.children().first().is(Button)).to.be.true();
  });

  it('Should contain 4 text paragraphs', () => {
    expect(wrapper.find('p')).to.have.length(4);
  });

  it('Should contain the email address', () => {
    const paragraph = wrapper.find('p.email');

    expect(paragraph).to.have.length(1);
    expect(paragraph.text()).to.equal(email);
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

        /*it('Should have prop `disabled` set to true if `isPending` is set to true', () => {
          loading = true;
          wrapper = getWrapper();

          expect(wrapper.find(Button).get(0).props.disabled).to.equal(true);
        });*/

        /*it('Should have prop `disabled` set to false if `isPending` is set to false', () => {
          isPending = false;
          wrapper = getWrapper();

          expect(wrapper.find(Button).get(0).props.disabled).to.equal(false);
        });
*/
        it('Should execute the `onSend` handler on click', () => {
          wrapper.find(Button).simulate('click');

          expect(onSend.callCount).to.equal(1);
          expect(onSend.firstCall.args[0]).to.eql(email);
        });

        /*it('Should show the `Spinner` if `isPending` is set to true', () => {
          isPending = true;
          wrapper = getWrapper();

          expect(wrapper.find(Spinner)).to.have.length(1);
          expect(wrapper.find(Button).contains(
            <div>
              <Spinner />
              {' '}
              <Trans>
                Send
              </Trans>
            </div>,
          )).to.be.true();
        });

        it('Should not show the `Spinner` if `isPending` is set to false', () => {
          isPending = false;
          wrapper = getWrapper();

          expect(wrapper.find(Spinner)).to.have.length(0);
          expect(wrapper.find(Button).contains(
            <Trans>
              Send
            </Trans>,
          )).to.be.true();
        });*/

      });
      describe('(Component) Request', () => {
        it('Should track email activation request with id', () => {
          expect(wrapper.find(Request).get(0).props.id).to.be.equal(emailActivationRequest.id);
        });

        it('Should provide request state props to wrapped `Button`', () => {
          const requestButton = wrapper.find(Request).children().get(0);
          expect(requestButton.props.loading).to.be.equal(false);
          expect(requestButton.props.disabled).to.be.equal(false);
        })
      });
    });
  });
});
