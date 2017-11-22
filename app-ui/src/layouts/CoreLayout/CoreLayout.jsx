// @flow
import React from 'react';
import Alert from 'react-s-alert';
import HeaderContainer from 'containers/HeaderContainer';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';

import './CoreLayout.scss';

type Props = {
  children: React.Node,
  headerNav?: React.Node,
};

const CoreLayout = ({ headerNav, children }: Props) => (
  <div id="core-layout">
    <HeaderContainer>{headerNav}</HeaderContainer>
    {children}
    <Alert
      stack={{ limit: 3 }}
      html
      effect="stackslide"
      position="bottom-right"
      beep={false}
      timeout={10000}
    />
  </div>
);

CoreLayout.defaultProps = {
  headerNav: null,
};

export default CoreLayout;
