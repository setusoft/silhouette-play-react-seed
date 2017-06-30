// @flow
import React from 'react';

import './Preloader.scss';

type Props = {
  preloaded: boolean,
  children: Element<any>,
}

/**
 * Preloader component which shows a loading indicator until the `preloaded` prop is set to true.
 */
const Preloader = ({ preloaded, children }: Props) => {
  if (preloaded) {
    return children;
  }

  return (
    <div className="preloader-wrapper">
      <div className="preloader" />
    </div>
  );
};

export default Preloader;
