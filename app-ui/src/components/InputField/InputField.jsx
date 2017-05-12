// @flow
import React from 'react';
import { Control, Errors } from 'react-redux-form';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { validationState, ErrorWrapper } from 'util/Form';
import type { FormProps } from 'util/Form';

type Props = {
  id: string,
  type: string,
  label: string,
  formProps: FormProps,
  validators: { [string]: (string) => boolean },
  messages?: { [string]: string },
  maxLength: number,
}

export const defaultMessages: { [string]: string } = {
  isRequired: 'This field is required',
  isEmail: 'Valid email required',
};

export default ({ id, type, label, formProps, validators, messages = {}, maxLength = 255 }: Props) => (
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
        ...defaultMessages,
        ...messages,
      }}
    />
  </FormGroup>
);
