// @flow
import React from 'react';

import type { Node } from 'react';

import './Preloader.scss';

type Props = {
  preloaded?: boolean,
  children?: Node,
}

/**
 * Preloader component which shows a loading indicator until the `preloaded` prop is set to true.
 */
const Preloader = ({ preloaded, children }: Props) => {
  if (preloaded && children) {
    return children;
  }

  return (
    <div className="preloader-wrapper">
      <div className="preloader" />
    </div>
  );
};

Preloader.defaultProps = {
  preloaded: false,
  children: undefined,
};

export default Preloader;
