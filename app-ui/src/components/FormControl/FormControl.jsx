// @flow
import omit from 'lodash/omit';
import React from 'react';
import { withI18n } from '@lingui/react';
import { Control, Errors } from 'react-redux-form';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { showErrors as defaultShowErrors, ErrorWrapper } from 'util/Form';

import type { Node, ComponentType } from 'react';
import type { FormProps } from 'util/Form';

import './FormControl.scss';

type Props = {
  id: string,
  model?: string,
  label?: string,
  help?: string,
  control?: ComponentType<*>,
  controlProps?: Object,
  component?: ComponentType<*>,
  optional?: boolean,
  feedback?: boolean,
  formProps: FormProps,
  showErrors?: FormProps => boolean,
  validators?: { [string]: (string) => boolean },
  messages?: { [string]: string },
  i18n: Object,
  children?: Node,
}

export const defaultMessages: (i18n: Object) => { [string]: string } = i18n => ({
  isRequired: i18n.t`This field is required`,
  isEmail: i18n.t`Valid email required`,
});

/**
 * A react-redux-form based form control component.
 *
 * We show only errors, because then the form looks more tidy and consistent especially if fields are prefilled
 * and not touched.
 *
 * @param id           The control ID.
 * @param model        The model path, defaults to the ID.
 * @param label        An additional control label.
 * @param help         An additional help block.
 * @param control      Any of the base control components provided by react-redux-form, defaults to the `Control`
 *                     component.
 * @param controlProps A mapping of control-specific props that will be applied directly to the rendered control.
 * @param component    A custom component can be passed into the component={...} prop, and standard control props
 *                     and event handlers (such as onChange, onBlur, onFocus, value, etc.) will be mapped as expected.
 *                     Defaults to the react-bootstrap `FormControl` component.
 * @param optional     Indicates if the control is optional.
 * @param feedback     Indicates if the feedback indicator should be shown.
 * @param formProps    The form props.
 * @param showErrors   A helper which indicates if errors should be shown in a form.
 * @param validators   The list of validators.
 * @param messages     The list of messages for the validators.
 * @param i18n         The i18n object.
 * @param children     An optional children to render.
 * @param rest         Additional properties that will be passed to the control.
 */
export const FormControlComponent = ({
  id,
  model,
  label,
  help,
  control,
  controlProps,
  component,
  optional,
  feedback,
  formProps,
  showErrors,
  validators,
  messages,
  i18n,
  children,
  ...rest
}: Props) => {
  const ControlComponent: ComponentType<*> = control || FormControlComponent.defaultProps.control;
  const hasErrors = (showErrors || defaultShowErrors)(formProps);

  const labelComponent = !label || (
    <ControlLabel>
      {label}
    </ControlLabel>
  );
  const optionalComponent = !optional || (
    <span className="optional">
      {`(${i18n.t`Optional`})`}
    </span>
  );
  const helpComponent = !help || (
    <p className="help">
      {help}
    </p>
  );
  const feedbackComponent = !feedback || <FormControl.Feedback />;

  return (
    <FormGroup
      controlId={`custom-form-control-${id}`}
      className={`custom-form-control ${id}`}
      validationState={hasErrors ? 'error' : null}
    >
      {labelComponent}
      {' '}
      {optionalComponent}
      {helpComponent}
      <div className="control">
        <ControlComponent
          model={`.${model || id}`}
          controlProps={controlProps}
          component={component}
          autoComplete="off"
          validators={validators}
          {...omit(rest, 'i18nHash')}
        >
          {children}
        </ControlComponent>
        {feedbackComponent}
      </div>
      <Errors
        model={`.${id}`}
        show={hasErrors}
        wrapper={ErrorWrapper}
        messages={{
          ...defaultMessages(i18n),
          ...messages,
        }}
      />
    </FormGroup>
  );
};

FormControlComponent.defaultProps = {
  model: undefined,
  label: undefined,
  help: undefined,
  control: Control,
  controlProps: undefined,
  component: FormControl,
  optional: false,
  feedback: true,
  showErrors: defaultShowErrors,
  validators: undefined,
  messages: {},
  children: undefined,
};

export default withI18n()(FormControlComponent);
