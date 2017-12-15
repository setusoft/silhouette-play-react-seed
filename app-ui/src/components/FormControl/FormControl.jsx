// @flow
import React from 'react';
import { Control, Errors } from 'react-redux-form';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { validationState as defaultValidationState, ErrorWrapper } from 'util/Form';
import { withI18n } from 'lingui-react';

import type { FormProps } from 'util/Form';

import './FormControl.scss';

type Props = {
  id: string,
  label?: string,
  help?: string,
  controlProps?: Object,
  formProps: FormProps,
  validationState?: FormProps => boolean,
  validators?: { [string]: (string) => boolean },
  messages?: { [string]: string },
  i18n: Object,
}

export const defaultMessages: (i18n: Object) => { [string]: string } = i18n => ({
  isRequired: i18n.t`This field is required`,
  isEmail: i18n.t`Valid email required`,
});

export const FormControlComponent = ({
  id, label, help, controlProps, formProps, validationState, validators, messages, i18n,
}: Props) => (
  <FormGroup
    controlId={id}
    className="custom-form-control"
    validationState={(validationState || defaultValidationState)(formProps)}
  >
    {!label || <ControlLabel>{label}</ControlLabel>}
    {!help || <p className="help">{help}</p>}
    <div className="control">
      <Control
        model={`.${id}`}
        controlProps={controlProps}
        component={FormControl}
        autoComplete="off"
        validators={validators}
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
    </div>
  </FormGroup>
);

FormControlComponent.defaultProps = {
  label: undefined,
  help: undefined,
  controlProps: undefined,
  validationState: defaultValidationState,
  validators: [],
  messages: {},
};

export default withI18n()(FormControlComponent);
