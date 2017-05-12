// @flow
import React from 'react';
import { Link } from 'react-router';
import { Panel, Button, Checkbox } from 'react-bootstrap';
import { Form, Control } from 'react-redux-form';
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
  onSignIn: () => any,
  $form: FormProps
}

export default ({ email, password, isPending, onSignIn, $form }: Props) => (
  <Panel className="sign-in" header="Sign in">
    <Form model={modelPath} onSubmit={onSignIn} autoComplete="off">
      <InputField
        id="email"
        type="email"
        label="Email"
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
        label="Password"
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
        Remember my login on this computer
      </Control.checkbox>
      <Button bsStyle="primary" type="submit" disabled={!$form.valid || isPending} block>
        {isPending ? <div><Spinner /> Sign in</div> : 'Sign in'}
      </Button>
    </Form>
    <p className="password-recovery"><Link to={config.route.auth.passwordRecovery}>Forgot your password?</Link></p>
  </Panel>
);
