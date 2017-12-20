import admin from 'bundles/Admin';
import Layout from 'bundles/Admin/components/Layout';

describe('(Bundle) Admin', () => {
  it('Should be exported as function', () => {
    expect(typeof admin).to.equal('function');
  });

  it('Should return the `Layout` component', () => {
    expect(admin()).to.eql(Layout);
  });
});
