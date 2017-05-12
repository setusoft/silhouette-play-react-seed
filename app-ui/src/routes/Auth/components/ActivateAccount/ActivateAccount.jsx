/* @flow */
import React from 'react';
import { Panel, Button } from 'react-bootstrap';
import Spinner from 'components/Spinner';

import './ActivateAccount.scss';

type Props = {
  email: string,
  isPending: boolean,
  onSend: (email: string) => any,
}

export default ({ email, isPending, onSend }: Props) => (
  <Panel className="activate-account" header="Activate account">
    <p>You can&apos;t log in yet. We previously sent an activation email to you at:</p>
    <p className="email">{email}</p>
    <p>Please follow the instructions in that email to activate your account.</p>
    <p>Click the button to send the activation email again.</p>
    <Button bsStyle="primary" type="button" disabled={isPending} onClick={() => onSend(email)} block>
      {isPending ? <div><Spinner /> Send</div> : 'Send'}
    </Button>
  </Panel>
);
