// @flow
import React from 'react';
import { HelpBlock, Popover, OverlayTrigger } from 'react-bootstrap';
import type { RequestProp } from 'questrar';
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


/**
 * Wraps a request message popup over a Request component child
 * @param request
 * @param child,
 * @param overlayOptions
 * @returns {*}
 */
export const popoverOnChild = (request: RequestProp, child: Node, overlayOptions: Object) => {
  let onClickWithRequest;
  const style = { };

  if (typeof overlayOptions.onClick === 'function') {
    style.cursor = 'pointer';
    onClickWithRequest = (event: SyntheticEvent<MouseEvent>) => overlayOptions.onClick(event, request);
  }

  const popoverOverlay = (
    <Popover
      id={request.data.id}
      {...overlayOptions}
      onClick={onClickWithRequest}
      style={style}
    >
      {request.data.message}
    </Popover>
  );

  return (
    <OverlayTrigger
      delayShow={400}
      defaultOverlayShown
      trigger="click"
      placement="right"
      overlay={popoverOverlay}
    >
      {child}
    </OverlayTrigger>
  );
};

/**
 * Wraps a request success message popup over a Request component child
 * @param options
 * @returns {*}
 */
export const popoverOnSuccess = (options: Object) => (request: RequestProp, child: Node) => {
  return request.data.success && request.data.message
    ? popoverOnChild(request, child, options)
    : child;
};

/**
 * Wraps a request failure message popover over a Request component child
 * @param options
 * @returns {*}
 */
export const popoverOnFailure = (options: Object) => (request: RequestProp, child: Node) => {
  return request.data.failed && request.data.message
    ? popoverOnChild(request, child, options)
    : child;
};
