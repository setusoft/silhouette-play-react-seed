// @flow
import React from 'react';
import { Button as BsButton } from 'react-bootstrap';
import Spinner from 'components/Spinner';
import type { Node } from 'react';
import './Element.scss';

type Props = {
  children: Node,
  loading: boolean,
  disabled: boolean,
  className: string,
  style: Object,
  bsStyle: string,
  type: string
}

export const Button = ({
  bsStyle, type, loading, disabled, children, ...rest
}: Props) => ( // $FlowFixMe
  <BsButton bsStyle={bsStyle} type={type} disabled={disabled} {...rest}>
    {loading ? (
      <div className="buttonContentWrap">
        <span className="buttonContent">
          {children}
        </span>
        <span className="sideSpinner">
          <Spinner />
        </span>
      </div>
    ) : children }
  </BsButton>
);

export default Button;
