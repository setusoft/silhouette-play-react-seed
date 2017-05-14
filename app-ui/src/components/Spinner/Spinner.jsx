import _ from 'lodash';
import React from 'react';

import './Spinner.scss';

const Spinner = () => (
  <div className="spinner">
    {_.range(1, 13).map(i =>
      <div key={i} className={`spinner-circle${i} spinner-circle`} />,
    )}
  </div>
);

export default Spinner;
