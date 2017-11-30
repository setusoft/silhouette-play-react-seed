/* @flow */
import React from 'react';
import { withI18n, Trans } from 'lingui-react';
import { Panel, Button } from 'react-bootstrap';
import Spinner from 'components/Spinner';

import './ActivateAccount.scss';

type Props = {
  email: string,
  isPending: boolean,
  i18n: Object,
  onSend: (email: string) => any,
}

export const ActivateAccountComponent = ({
  email, isPending, i18n, onSend,
}: Props) => (
  <Panel className="activate-account" header={i18n.t`Activate account`}>
    <p><Trans>You can&apos;t log in yet. We previously sent an activation email to you at:</Trans></p>
    <p className="email">{email}</p>
    <p><Trans>Please follow the instructions in that email to activate your account.</Trans></p>
    <p><Trans>Click the button to send the activation email again.</Trans></p>
    <Button bsStyle="primary" type="button" disabled={isPending} onClick={() => onSend(email)} block>
      {isPending ? <div><Spinner /> <Trans>Send</Trans></div> : <Trans>Send</Trans>}
    </Button>
  </Panel>
);

export default withI18n()(ActivateAccountComponent);
