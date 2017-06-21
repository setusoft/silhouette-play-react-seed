import React from 'react';
import { Alert, Panel } from 'react-bootstrap';
import './Dashboard.scss';

const Dashboard = () => (
  <Panel className="dashboard">
    <div>
      <Alert bsStyle="success">
        <strong>Success</strong> You successfully authenticated.
      </Alert>
    </div>
  </Panel>
);

Dashboard.propTypes = {

};

export default Dashboard;
