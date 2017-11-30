// @flow
import React from 'react';
import { Link } from 'react-router';
import { Panel, Button, Checkbox } from 'react-bootstrap';
import { Form, Control } from 'react-redux-form';
import { withI18n, Trans } from 'lingui-react';
import { isRequired } from 'util/Validator';
import { modelPath } from 'routes/Auth/modules/SignInModule';
import InputField from 'components/InputField';
import isEmail from 'validator/lib/isEmail';
import Spinner from 'components/Spinner';
import config from 'config/index';
import type { FormProps } from 'util/Form';

import './SignIn.scss';

type Props = {
  email: FormProps,
  password: FormProps,
  isPending: boolean,
  i18n: Object,
  onSignIn: () => any,
  $form: FormProps
}

export const SignInComponent = ({
  email, password, isPending, i18n, onSignIn, $form,
}: Props) => (
  <Panel className="sign-in" header={i18n.t`Sign-In`}>
    <Form model={modelPath} onSubmit={onSignIn} autoComplete="off">
      <InputField
        id="email"
        type="email"
        label={i18n.t`Email`}
        formProps={email}
        maxLength="255"
        validators={{
          isRequired,
          isEmail,
        }}
      />
      <InputField
        id="password"
        type="password"
        label={i18n.t`Password`}
        formProps={password}
        maxLength="255"
        validators={{
          isRequired,
        }}
      />
      <Control.checkbox
        model=".rememberMe"
        component={Checkbox}
      >
        <Trans>Remember my login on this computer</Trans>
      </Control.checkbox>
      <Button bsStyle="primary" type="submit" disabled={!$form.valid || isPending} block>
        {isPending ? <div><Spinner /> <Trans>Sign in</Trans></div> : <Trans>Sign in</Trans>}
      </Button>
    </Form>
    <p className="password-recovery-link">
      <Link to={config.route.auth.passwordRecovery}><Trans>Forgot your password?</Trans></Link>
    </p>
  </Panel>
);

export default withI18n()(SignInComponent);
