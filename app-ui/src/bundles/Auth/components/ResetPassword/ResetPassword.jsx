// @flow
import React from 'react';
import { Panel, Button } from 'react-bootstrap';
import { Form } from 'react-redux-form';
import { withI18n, Trans } from 'lingui-react';
import { isRequired } from 'util/Validator';
import { modelPath } from 'bundles/Auth/modules/ResetPasswordModule';
import FormControl from 'components/FormControl';
import Spinner from 'components/Spinner';
import type { FormProps } from 'util/Form';

type Props = {
  token: string,
  form: {[string]: FormProps},
  isPending: boolean,
  i18n: Object,
  onReset: (token: string, data: Object) => any,
}

export const ResetPasswordComponent = ({
  token, form, isPending, i18n, onReset,
}: Props) => (
  <Panel className="reset-password" header={i18n.t`Reset password`}>
    <p>
      <Trans>Strong passwords include numbers, letters and special characters.</Trans>
    </p>
    <Form model={modelPath} onSubmit={data => onReset(token, data)} autoComplete="off">
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
      <Button bsStyle="primary" type="submit" disabled={!form.$form.valid || isPending} block>
        {isPending ? <div><Spinner /> <Trans>Reset</Trans></div> : <Trans>Reset</Trans>}
      </Button>
    </Form>
  </Panel>
);

export default withI18n()(ResetPasswordComponent);
