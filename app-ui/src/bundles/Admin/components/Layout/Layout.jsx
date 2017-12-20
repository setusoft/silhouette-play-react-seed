// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CoreLayout from 'components/CoreLayout';
import { NotFoundRoute } from 'components/NotFound';
import Dashboard from 'bundles/Admin/components/Dashboard';
import config from 'config/index';

import './Layout.scss';

export default () => (
  <CoreLayout>
    <div className="admin-container">
      <Switch>
        <Route exact path={config.route.admin.index} component={Dashboard} />
        <NotFoundRoute />
      </Switch>
    </div>
  </CoreLayout>
);
