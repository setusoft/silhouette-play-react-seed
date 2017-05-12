// @flow
import React from 'react';
import { Link } from 'react-router';
import { Panel, Button } from 'react-bootstrap';
import { Form } from 'react-redux-form';
import { isRequired } from 'util/Validator';
import { modelPath } from 'routes/Auth/modules/SignUpModule';
import InputField from 'components/InputField';
import isEmail from 'validator/lib/isEmail';
import Spinner from 'components/Spinner';
import config from 'config/index';
import type { FormProps } from 'util/Form';

import './SignUp.scss';

type Props = {
  name: FormProps,
  email: FormProps,
  password: FormProps,
  isPending: boolean,
  onSignUp: () => any,
  $form: FormProps
}

export default ({ name, email, password, isPending, onSignUp, $form }: Props) => (
  <Panel className="sign-up" header="Sign up">
    <Form model={modelPath} onSubmit={onSignUp} autoComplete="off">
      <InputField
        id="name"
        type="text"
        label="Name"
        formProps={name}
        maxLength="255"
        validators={{
          isRequired,
        }}
      />
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
      <Button bsStyle="primary" type="submit" disabled={!$form.valid || isPending} block>
        {isPending ? <div><Spinner /> Sign up</div> : 'Sign up'}
      </Button>
    </Form>
    <p className="sign-in">Already a member? <Link to={config.route.auth.signIn}>Sign in now</Link></p>
  </Panel>
);
