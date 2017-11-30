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
    const layout = (
      <InitializedContentLayout>
        <Dashboard />
      </InitializedContentLayout>
    );

    expect(wrapper.contains(layout)).to.be.true();
  });
});
