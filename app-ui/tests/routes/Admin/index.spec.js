import adminRoute from 'routes/Admin';
import config from 'config/index';

describe('(Route) Admin', () => {
  let route;

  beforeEach(() => {
    route = adminRoute({});
  });

  it('Should return a route configuration object', () => {
    expect(typeof route).to.equal('object');
  });

  it('Configuration should contain path `/admin`', () => {
    expect(route.path).to.equal(config.route.admin.index);
  });
});
