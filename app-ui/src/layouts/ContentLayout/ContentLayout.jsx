import React from 'react';
import CoreLayout from 'layouts/CoreLayout';

import './ContentLayout.scss';

const ContentLayout = ({ headerNav, children }) => (
  <CoreLayout headerNav={headerNav}>
    <div className="content-container">
      {children}
    </div>
  </CoreLayout>
);

ContentLayout.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]).isRequired,
  headerNav: React.PropTypes.element,
};

ContentLayout.defaultProps = {
  headerNav: null,
};

export default ContentLayout;
