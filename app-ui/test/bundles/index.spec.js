import { admin, auth } from 'bundles';

describe('Bundles', () => {
  it('Should export the `admin` bundle', () => {
    expect(admin).to.be.a('function');
  });

  it('Should export the `auth` bundle', () => {
    expect(auth).to.be.a('function');
  });
});
