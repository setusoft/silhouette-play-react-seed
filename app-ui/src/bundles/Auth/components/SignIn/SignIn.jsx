// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Panel, Checkbox } from 'react-bootstrap';
import { Button } from 'components/Elements';
import { Form, Control } from 'react-redux-form';
import { withI18n, Trans } from '@lingui/react';
import { isRequired } from 'util/Validator';
import { modelPath } from 'bundles/Auth/modules/SignInModule';
import FormControl from 'components/FormControl';
import isEmail from 'validator/lib/isEmail';
import config from 'config/index';
import type { FormProps } from 'util/Form';
import { Request } from 'questrar';
import { signInRequest } from "bundles/Auth/modules/SignInModule";
import { requestButtonProps } from "bundles/Auth/selectors/AuthSelectors";

import './SignIn.scss';

type Props = {
  form: {[string]: FormProps},
  isPending: boolean,
  i18n: Object,
  onSignIn: () => any,
}

export const SignInComponent = ({
  form, i18n, onSignIn,
}: Props) => (
  <Panel className="sign-in">
    <Panel.Heading>
      <Trans>
        Sign-In
      </Trans>
    </Panel.Heading>
    <Panel.Body collapsible={false}>
      <Form model={modelPath} onSubmit={onSignIn} autoComplete="off">
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
        <FormControl
          id="password"
          label={i18n.t`Password`}
          formProps={form.password}
          controlProps={{
            type: 'password',
            placeholder: i18n.t`Password`,
          }}
          validators={{
            isRequired,
          }}
        />
        <Control.checkbox model=".rememberMe" component={Checkbox}>
          <Trans>
            Remember my login on this computer
          </Trans>
        </Control.checkbox>
        <Request
          id={signInRequest.id}
          passivePending
          failTooltip
          passiveOnFailure
          inject={requestButtonProps(!form.$form.valid)}
        >
          <Button bsStyle="primary" type="submit" block>
            <Trans>Sign in</Trans>
          </Button>
        </Request>
      </Form>
      <p className="password-recovery-link">
        <Link to={config.route.auth.passwordRecovery}>
          <Trans>
            Forgot your password?
          </Trans>
        </Link>
      </p>
    </Panel.Body>
  </Panel>
);

export default withI18n()(SignInComponent);
