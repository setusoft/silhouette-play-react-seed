import React from 'react';
import ContentLayout from 'layouts/ContentLayout';
import Dashboard from 'routes/Admin/components/Dashboard';
import { secured } from 'routes/Auth/util/wrappers';

export const AdminLayoutComponent = () => (
  <ContentLayout>
    <Dashboard />
  </ContentLayout>
);

export default secured(AdminLayoutComponent);
