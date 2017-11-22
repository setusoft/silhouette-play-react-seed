// @flow
import * as React from 'react';
import CoreLayout from 'layouts/CoreLayout';

import './ContentLayout.scss';

type Props = {
  children: React.Node,
  headerNav?: React.Node,
};

const ContentLayout = ({ headerNav, children }: Props) => (
  <CoreLayout headerNav={headerNav}>
    <div className="content-container">
      {children}
    </div>
  </CoreLayout>
);

ContentLayout.defaultProps = {
  headerNav: null,
};

export default ContentLayout;
