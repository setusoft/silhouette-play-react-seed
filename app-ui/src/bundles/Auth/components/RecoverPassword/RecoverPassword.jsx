// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Panel, Button } from 'react-bootstrap';
import { Form } from 'react-redux-form';
import { withI18n, Trans } from 'lingui-react';
import { isRequired } from 'util/Validator';
import { modelPath } from 'bundles/Auth/modules/RecoverPasswordModule';
import FormControl from 'components/FormControl';
import isEmail from 'validator/lib/isEmail';
import Spinner from 'components/Spinner';
import config from 'config/index';
import type { FormProps } from 'util/Form';

import './RecoverPassword.scss';

type Props = {
  form: {[string]: FormProps},
  isPending: boolean,
  i18n: Object,
  onSend: () => any,
}

export const RecoverPasswordComponent = ({
  form, isPending, i18n, onSend,
}: Props) => (
  <Panel className="recover-password" header={i18n.t`Recover password`}>
    <p>
      <Trans>
        Please enter your email address and we will send you an email with further instructions to reset your password.
      </Trans>
    </p>
    <Form model={modelPath} onSubmit={onSend} autoComplete="off">
      <FormControl
        id="email"
        label={i18n.t`Email`}
        formProps={form.email}
        controlProps={{
          type: 'email',
          placeholder: i18n.t`Email`,
          maxLength: 255,
        }}
        validators={{
          isRequired,
          isEmail,
        }}
      />
      <Button bsStyle="primary" type="submit" disabled={!form.$form.valid || isPending} block>
        {isPending ? <div><Spinner /> <Trans>Submit</Trans></div> : <Trans>Submit</Trans>}
      </Button>
      <p className="sign-in-link"><Link to={config.route.auth.signIn}><Trans>Back to Sign-In</Trans></Link></p>
    </Form>
  </Panel>
);

export default withI18n()(RecoverPasswordComponent);
