// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Panel } from 'react-bootstrap';
import { Button } from 'components/Elements';
import { Form } from 'react-redux-form';
import { withI18n, Trans } from '@lingui/react';
import { isRequired } from 'util/Validator';
import { modelPath, recoverPasswordRequest } from 'bundles/Auth/modules/RecoverPasswordModule';
import FormControl from 'components/FormControl';
import isEmail from 'validator/lib/isEmail';
import config from 'config/index';
import type { FormProps } from 'util/Form';
import { Request } from 'questrar';
import { requestButtonProps } from 'bundles/Auth/selectors/AuthSelectors';

import './RecoverPassword.scss';

type Props = {
  form: {[string]: FormProps},
  i18n: Object,
  onSend: () => any,
  onRecover: () => void,
}

export const RecoverPasswordComponent = ({
  form, onRecover, i18n, onSend,
}: Props) => (
  <Panel className="recover-password">
    <Panel.Heading>
      <Trans>
        Recover password
      </Trans>
    </Panel.Heading>
    <Panel.Body collapsible={false}>
      <p>
        <Trans>
          Please enter your email address and we will send you an email with further instructions to reset your
          password.
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
        <Request
          id={recoverPasswordRequest.id}
          passivePending
          popoverOnSuccess
          onCloseSuccess={onRecover}
          inject={requestButtonProps(form.$form.valid)}
        >
          <Button bsStyle="primary" type="submit" block>
            <Trans>
              Submit
            </Trans>
          </Button>
        </Request>
        <p className="sign-in-link">
          <Link to={config.route.auth.signIn}>
            <Trans>
              Back to Sign-In
            </Trans>
          </Link>
        </p>
      </Form>
    </Panel.Body>
  </Panel>
);

export default withI18n()(RecoverPasswordComponent);
