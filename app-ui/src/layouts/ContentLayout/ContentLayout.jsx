// @flow
import React from 'react';
import CoreLayout from 'layouts/CoreLayout';

import type { Node } from 'react';

import './ContentLayout.scss';

type Props = {
  children: Node,
  headerNav?: Node,
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
