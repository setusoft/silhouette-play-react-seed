// @flow
import React from 'react';
import { Control, Errors } from 'react-redux-form';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { validationState, ErrorWrapper } from 'util/Form';
import { WithI18n } from 'lingui-react';

import type { FormProps } from 'util/Form';

type Props = {
  id: string,
  type: string,
  label: string,
  formProps: FormProps,
  validators: { [string]: (string) => boolean },
  messages?: { [string]: string },
  maxLength: number,
  i18n: Object,
}

export const defaultMessages: (i18n: Object) => { [string]: string } = i18n => ({
  isRequired: i18n.t`This field is required`,
  isEmail: i18n.t`Valid email required`,
});

export const InputFieldComponent = ({
  id, type, label, formProps, validators, messages, maxLength = 255, i18n,
}: Props) => (
  <FormGroup controlId={id} className="input-field" validationState={validationState(formProps)}>
    <ControlLabel>{label}</ControlLabel>
    <Control
      model={`.${id}`}
      type={type}
      placeholder={label}
      component={FormControl}
      autoComplete="off"
      validators={validators}
      maxLength={maxLength}
    />
    <FormControl.Feedback />
    <Errors
      model={`.${id}`}
      show="touched"
      wrapper={ErrorWrapper}
      messages={{
        ...defaultMessages(i18n),
        ...messages,
      }}
    />
  </FormGroup>
);

InputFieldComponent.defaultProps = {
  messages: {},
};

export default WithI18n()(InputFieldComponent);
