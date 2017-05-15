import React from 'react';
import PropTypes from 'prop-types';
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
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  headerNav: PropTypes.element,
};

ContentLayout.defaultProps = {
  headerNav: null,
};

export default ContentLayout;
