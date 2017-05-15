import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';
import HeaderContainer from 'containers/HeaderContainer';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';

import './CoreLayout.scss';

const CoreLayout = ({ headerNav, children }) => (
  <div id="core-layout">
    <HeaderContainer>{headerNav}</HeaderContainer>
    <div className="main-container">
      {children}
    </div>
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

CoreLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  headerNav: PropTypes.element,
};

CoreLayout.defaultProps = {
  headerNav: null,
};

export default CoreLayout;
