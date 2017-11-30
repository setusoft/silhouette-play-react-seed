// @flow
import React from 'react';
import { HelpBlock } from 'react-bootstrap';

import type { Node } from 'react';

/**
 * The props for a "react-redux-form" related entity.
 */
export type FormProps = {
  submitted: boolean,
  touched: boolean,
  valid: boolean,
  validated: boolean,
}

/**
 * A helper which returns the "react-bootstrap" validation state.
 *
 * @param field The field.
 * @returns If the field was not touched then null, otherwise 'success' if the validation was
 * successful or 'error' if the validation has failed.
 */
export const validationState = (field: FormProps): ?string => {
  if (!field.touched) {
    return null;
  }

  return field.valid ? 'success' : 'error';
};

/**
 * Wraps a "react-redux-form" field error into a "react-bootstrap" `HelpBlock`.
 *
 * It shows also only one error instead of all errors.
 *
 * @param children The field errors.
 */
export const ErrorWrapper = ({ children }: { children: Node }) => (
  <HelpBlock>
    {React.Children.toArray(children)[0]}
  </HelpBlock>
);
