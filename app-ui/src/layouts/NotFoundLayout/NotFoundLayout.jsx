// @flow
import React from 'react';
import { Trans } from 'lingui-react';
import { Link } from 'react-router';
import CoreLayout from 'layouts/CoreLayout';
import config from 'config/index';

import './NotFoundLayout.scss';

const NotFoundLayout = () => (
  <CoreLayout>
    <div className="not-found-container">
      <p className="code">404</p>
      <p><Trans>The Page you are looking for could not be found!</Trans></p>
      <p><Link to={config.route.index}><Trans>Back to Home</Trans></Link></p>
    </div>
  </CoreLayout>
);

export default NotFoundLayout;
