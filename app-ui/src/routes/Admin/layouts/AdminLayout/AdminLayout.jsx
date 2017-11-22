import React from 'react';
import ContentLayout from 'layouts/ContentLayout';
import Dashboard from 'routes/Admin/components/Dashboard';
import { secured } from 'routes/Auth/util/wrappers';
import initializer from 'containers/InitializerContainer';
import { initAppContent } from 'modules/AppModule';

export const InitializedContentLayout = initializer(ContentLayout, initAppContent);

export const AdminLayoutComponent = () => (
  <InitializedContentLayout>
    <Dashboard />
  </InitializedContentLayout>
);

export default secured(AdminLayoutComponent);
