// @flow
import React from 'react';
import { Panel } from 'react-bootstrap';
import { Button } from 'components/Elements';
import { Form } from 'react-redux-form';
import { withI18n, Trans } from '@lingui/react';
import { isRequired } from 'util/Validator';
import { modelPath, resetPasswordRequest } from 'bundles/Auth/modules/ResetPasswordModule';
import FormControl from 'components/FormControl';
import type { FormProps } from 'util/Form';
import { Request } from 'questrar';
import { requestButtonProps } from 'bundles/Auth/selectors/AuthSelectors';


type Props = {
  token: string,
  form: {[string]: FormProps},
  i18n: Object,
  onReset: (token: string, data: Object) => any,
  onResetFailure: () => void,
  onResetSuccess: () => void,
}

export const ResetPasswordComponent = ({
  token, form, i18n, onReset, onResetSuccess, onResetFailure,
}: Props) => (
  <Panel className="reset-password">
    <Panel.Heading>
      <Trans>
        Reset password
      </Trans>
    </Panel.Heading>
    <Panel.Body collapsible={false}>
      <p>
        <Trans>
          Strong passwords include numbers, letters and special characters.
        </Trans>
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
        <Request
          id={resetPasswordRequest.id}
          passivePending
          popoverOnFail
          onCloseFailure={onResetFailure}
          onCloseSuccess={onResetSuccess}
          inject={requestButtonProps(form.$form.valid)}
        >
          <Button bsStyle="primary" type="submit" block>
            <Trans>
              Reset
            </Trans>
          </Button>
        </Request>
      </Form>
    </Panel.Body>
  </Panel>
);

export default withI18n()(ResetPasswordComponent);
