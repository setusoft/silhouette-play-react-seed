import React from 'react';
import { shallow } from 'enzyme';
import ContentLayout from 'layouts/ContentLayout';
import Dashboard from 'routes/Admin/components/Dashboard';
import { AdminLayoutComponent } from 'routes/Admin/layouts/AdminLayout/AdminLayout';

describe('(Layout) Admin/AdminLayout', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<AdminLayoutComponent />);
  });

  it('Should extend the `CoreLayout`', () => {
    expect(wrapper.contains(
      <ContentLayout>
        <Dashboard />
      </ContentLayout>,
    )).to.be.true();
  });
});
