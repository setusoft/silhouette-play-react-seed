/* @flow */
import React from 'react';
import { Trans } from '@lingui/react';
import { Panel, Button } from 'react-bootstrap';
import Spinner from 'components/Spinner';

import './ActivateAccount.scss';

type Props = {
  email: string,
  isPending: boolean,
  onSend: (email: string) => any,
}

export const ActivateAccountComponent = ({
  email, isPending, onSend,
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
      <Button bsStyle="primary" type="button" disabled={isPending} onClick={() => onSend(email)} block>
        {isPending ? (
          <div>
            <Spinner />
            {' '}
            <Trans>
              Send
            </Trans>
          </div>
        ) : (
          <Trans>
            Send
          </Trans>
        )}
      </Button>
    </Panel.Body>
  </Panel>
);

export default ActivateAccountComponent;
