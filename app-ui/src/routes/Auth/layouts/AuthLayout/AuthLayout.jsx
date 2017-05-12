import React from 'react';
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
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]).isRequired,
};

export default unsecured(AuthLayoutComponent);
