// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Panel } from 'react-bootstrap';
import { Button } from 'components/Elements';
import { Form } from 'react-redux-form';
import { withI18n, Trans } from '@lingui/react';
import { isRequired } from 'util/Validator';
import { modelPath } from 'bundles/Auth/modules/SignUpModule';
import FormControl from 'components/FormControl';
import isEmail from 'validator/lib/isEmail';
import config from 'config/index';
import type { FormProps } from 'util/Form';
import { Request } from 'questrar';
import { signUpRequest } from "bundles/Auth/modules/SignUpModule";
import { requestButtonProps } from "bundles/Auth/selectors/AuthSelectors";

import './SignUp.scss';

type Props = {
  form: {[string]: FormProps},
  isPending: boolean,
  i18n: Object,
  onSignUp: () => any,
}

export const SignUpComponent = ({
  form, isPending, i18n, onSignUp,
}: Props) => (
  <Panel className="sign-up">
    <Panel.Heading>
      <Trans>
        Sign-Up
      </Trans>
    </Panel.Heading>
    <Panel.Body collapsible={false}>
      <Form model={modelPath} onSubmit={onSignUp} autoComplete="off">
        <FormControl
          id="name"
          label={i18n.t`Name`}
          formProps={form.name}
          controlProps={{
            type: 'text',
            placeholder: i18n.t`Name`,
            maxLength: 255,
          }}
          validators={{
            isRequired,
          }}
        />
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
        <Request
          id={signUpRequest.id}
          passivePending
          successTooltip
          className="sign-up-button"
          inject={requestButtonProps(!form.$form.valid)}
        >
          <Button bsStyle="primary" type="submit"  block>
            <Trans>Sign up</Trans>
          </Button>
        </Request>
      </Form>
      <p className="sign-in">
        <Trans>
          Already a member?
        </Trans>
        {' '}
        <Link to={config.route.auth.signIn}>
          <Trans>
            Sign in now
          </Trans>
        </Link>
      </p>
    </Panel.Body>
  </Panel>
);

export default withI18n()(SignUpComponent);
