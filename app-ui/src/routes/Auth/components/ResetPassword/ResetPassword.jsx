// @flow
import React from 'react';
import { Panel, Button } from 'react-bootstrap';
import { Form } from 'react-redux-form';
import { isRequired } from 'util/Validator';
import { modelPath } from 'routes/Auth/modules/ResetPasswordModule';
import InputField from 'components/InputField';
import Spinner from 'components/Spinner';
import type { FormProps } from 'util/Form';

type Props = {
  token: string,
  password: FormProps,
  isPending: boolean,
  onReset: () => any,
  $form: FormProps,
}

const ResetPassword = ({ token, password, isPending, onReset, $form }: Props) => (
  <Panel className="reset-password" header="Reset password">
    <p>
      Strong passwords include numbers, letters and punctuation marks.
    </p>
    <Form model={modelPath} onSubmit={data => onReset(token, data)} autoComplete="off">
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
        {isPending ? <div><Spinner /> Reset</div> : 'Reset'}
      </Button>
    </Form>
  </Panel>
);

export default ResetPassword;
