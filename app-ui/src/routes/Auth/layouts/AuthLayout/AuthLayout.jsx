import React from 'react';
import PropTypes from 'prop-types';
import CoreLayout from 'layouts/CoreLayout';
import { unsecured } from 'routes/Auth/util/wrappers';

import './AuthLayout.scss';

export const AuthLayoutComponent = ({ children }) => (
  <CoreLayout>
    <div className="auth-container">
      {children}
    </div>
  </CoreLayout>
);

AuthLayoutComponent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default unsecured(AuthLayoutComponent);
