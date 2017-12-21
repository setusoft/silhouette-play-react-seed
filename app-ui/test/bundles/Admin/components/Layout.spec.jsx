import React from 'react';
import { shallow } from 'enzyme';
import { Route, Switch } from 'react-router-dom';
import CoreLayout from 'components/CoreLayout';
import { NotFoundRoute } from 'components/NotFound';
import Dashboard from 'bundles/Admin/components/Dashboard';
import Layout from 'bundles/Admin/components/Layout';
import config from 'config/index';

describe('(Component) Admin/Layout', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Layout />);
  });

  it('Should contain the `CoreLayout` as root element', () => {
    expect(wrapper.first().is(CoreLayout)).to.be.true();
  });

  it('Should contain a div with the class name `admin-container`', () => {
    expect(wrapper.find('div.admin-container')).to.have.length(1);
  });

  it('Should contain the `Switch` component as child of the `admin-container` div', () => {
    expect(wrapper.find('div.admin-container').children().first().is(Switch)).to.be.true();
  });

  describe('(Component) Switch', () => {
    it('Should contain the /admin route at index 0', () => {
      const route = <Route exact path={config.route.admin.index} component={Dashboard} />;

      expect(wrapper.find(Switch).children().at(0).contains(route)).to.be.true();
    });

    it('Should contain the not found route as last', () => {
      expect(wrapper.find(Switch).children().last().is(NotFoundRoute)).to.be.true();
    });
  });
});
