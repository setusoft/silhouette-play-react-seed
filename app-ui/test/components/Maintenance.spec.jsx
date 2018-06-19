import React from 'react';
import { shallow } from 'enzyme';
import { Trans } from 'lingui-react';
import Maintenance from 'components/Maintenance';

describe('(Component) Maintenance', () => {
  const children = <div>Healthy</div>;
  const wrapper = ({ healthy = true } = {}) =>
    shallow(<Maintenance healthy={healthy}>{children}</Maintenance>);

  it('Should show the children if the app is healthy', () => {
    expect(wrapper({ healthy: true }).contains(children)).to.be.true();
  });

  it('Should show the maintenance message if the app isn\'t healthy', () => {
    expect(wrapper({ healthy: false }).find('#maintenance')).to.have.length(1);
  });

  describe('(Block) maintenance', () => {
    it('Should contain a title', () => {
      expect(wrapper({ healthy: false })
        .contains(<p className="title"><Trans>Maintenance</Trans></p>)).to.be.true();
    });

    it('Should contain an error description', () => {
      expect(wrapper({ healthy: false })
        .contains(<p><Trans>The Page is currently under maintenance!</Trans></p>)).to.be.true();
    });
  });
});
