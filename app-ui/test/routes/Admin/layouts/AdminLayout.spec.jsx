import React from 'react';
import { shallow } from 'enzyme';
import Dashboard from 'routes/Admin/components/Dashboard';
import { AdminLayoutComponent, InitializedContentLayout } from 'routes/Admin/layouts/AdminLayout/AdminLayout';

describe('(Layout) Admin/AdminLayout', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<AdminLayoutComponent />);
  });

  it('Should extend the `ContentLayout`', () => {
    expect(wrapper.contains(
      <InitializedContentLayout>
        <Dashboard />
      </InitializedContentLayout>,
    )).to.be.true();
  });
});
