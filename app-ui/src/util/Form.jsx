// @flow
import React from 'react';
import { HelpBlock } from 'react-bootstrap';

import type { Node } from 'react';

/**
 * The props for a "react-redux-form" related entity.
 */
export type FormProps = {
  focus: boolean,
  submitted: boolean,
  touched: boolean,
  pristine: boolean,
  valid: boolean,
  validated: boolean,
  $form?: FormProps,
}

/**
 * A helper which indicates if errors should be shown in a form.
 *
 * Forms can be infinitely nested. You can have a form inside a form inside a form! Any sub-model inside a form that
 * isn't a primitive value, such as an object or array, is considered a form. Its form state is accessed with .$form.
 * @see https://davidkpiano.github.io/react-redux-form/docs/api/formReducer.html
 *
 * @param formProps The form props.
 * @returns True if the field is invalid and if it's either touched, submitted or focused and not pristine,
 * false otherwise.
 */
export const showErrors = (formProps: FormProps): boolean => {
  if (formProps.$form) {
    return showErrors(formProps.$form);
  }

  return (formProps.touched || formProps.submitted || (formProps.focus && !formProps.pristine)) && !formProps.valid;
};

/**
 * Wraps a "react-redux-form" field error into a "react-bootstrap" `HelpBlock`.
 *
 * It shows also only one error instead of all errors.
 *
 * @param children The field errors.
 * @returns A "react-bootstrap" `HelpBlock`
 */
export const ErrorWrapper = ({ children }: { children: Node }) => (
  <HelpBlock>
    {React.Children.toArray(children)[0]}
  </HelpBlock>
);
