// @flow
import React from 'react';
import { Panel, Button } from 'react-bootstrap';
import { Form } from 'react-redux-form';
import { isRequired } from 'util/Validator';
import { modelPath } from 'routes/Auth/modules/RecoverPasswordModule';
import InputField from 'components/InputField';
import isEmail from 'validator/lib/isEmail';
import Spinner from 'components/Spinner';
import type { FormProps } from 'util/Form';

type Props = {
  email: FormProps,
  isPending: boolean,
  onSend: () => any,
  $form: FormProps,
}

export default ({ email, isPending, onSend, $form }: Props) => (
  <Panel className="recover-password" header="Recover password">
    <p>
      Please enter your email address and we will send you an email with further instructions to reset your password.
    </p>
    <Form model={modelPath} onSubmit={onSend} autoComplete="off">
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
      <Button bsStyle="primary" type="submit" disabled={!$form.valid || isPending} block>
        {isPending ? <div><Spinner /> Send</div> : 'Send'}
      </Button>
    </Form>
  </Panel>
);
