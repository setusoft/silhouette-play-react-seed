// @flow
import React from 'react';
import { Trans } from 'lingui-react';

import type { Node } from 'react';

import './Maintenance.scss';

type Props = {
  healthy?: boolean,
  children?: Node,
}

const Maintenance = ({ healthy, children }: Props) => {
  if (healthy && children) {
    return children;
  }

  return (
    <div id="maintenance">
      <p className="title"><Trans>Maintenance</Trans></p>
      <p><Trans>The Page is currently under maintenance!</Trans></p>
    </div>
  );
};

Maintenance.defaultProps = {
  healthy: false,
  children: undefined,
};

export default Maintenance;
