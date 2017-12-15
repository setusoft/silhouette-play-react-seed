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
  pristine: boolean,
  valid: boolean,
  validated: boolean,
}

/**
 * A helper which returns the "react-bootstrap" validation state.
 *
 * We show only errors, because then the form looks more tidy and consistent especially if fields are prefilled
 * and not touched.
 *
 * @param field The field.
 * @returns If the field was not touched or the field is valid then null, otherwise 'error' if the validation
 * has failed.
 */
export const validationState = (field: FormProps): ?string => (!field.touched || field.valid ? null : 'error');

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
