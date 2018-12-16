/* @flow */
import React from 'react';
import { Trans } from '@lingui/react';
import { Panel } from 'react-bootstrap';
import { popoverOnSuccess, popoverOnFailure } from 'util/Form';
import { Button } from 'components/Elements';
import { Request } from 'questrar';
import { emailActivationRequest } from 'bundles/Auth/modules/ActivateAccountModule';
import { requestButtonProps } from 'bundles/Auth/selectors/AuthSelectors';

import './ActivateAccount.scss';

type Props = {
  email: string,
  onSend: (email: string) => any,
  onActivationSent: () => void,
}

export const ActivateAccountComponent = ({
  email, onSend, onActivationSent,
}: Props) => (
  <Panel className="activate-account">
    <Panel.Heading>
      <Trans>
        Activate account
      </Trans>
    </Panel.Heading>
    <Panel.Body collapsible={false}>
      <p>
        <Trans>
          You can&apos;t log in yet. We previously sent an activation email to you at:
        </Trans>
      </p>
      <p className="email">
        {email}
      </p>
      <p>
        <Trans>
          Please follow the instructions in that email to activate your account.
        </Trans>
      </p>
      <p>
        <Trans>
          Click the button to send the activation email again.
        </Trans>
      </p>
      <Request
        id={emailActivationRequest.id}
        inject={requestButtonProps()}
        onSuccess={popoverOnSuccess({
          title: (
            <Trans>
              Activation Email Sent
            </Trans>
          ),
          onClick: onActivationSent,
        })}
      >
        <Button bsStyle="primary" type="button" onClick={() => onSend(email)} block>
          <Trans>
            Send
          </Trans>
        </Button>
      </Request>
    </Panel.Body>
  </Panel>
);

export default ActivateAccountComponent;
