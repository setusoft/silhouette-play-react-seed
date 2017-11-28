import React from 'react';
import ContentLayout from 'layouts/ContentLayout';
import Dashboard from 'routes/Admin/components/Dashboard';
import lifecycle from 'containers/LifecycleContainer';
import { secured } from 'routes/Auth/util/wrappers';
import { initAppContent } from 'modules/AppModule';

export const InitializedContentLayout = lifecycle(ContentLayout, { componentWillMount: initAppContent });

export const AdminLayoutComponent = () => (
  <InitializedContentLayout>
    <Dashboard />
  </InitializedContentLayout>
);

export default secured(AdminLayoutComponent);
