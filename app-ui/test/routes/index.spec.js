import sinon from 'sinon';
import mainRoute from 'routes';
import adminRoute from 'routes/Admin';
import authRoute from 'routes/Auth';
import NotFoundLayout from 'layouts/NotFoundLayout';

describe('(Route) Main', () => {
  let route;

  beforeEach(() => {
    route = mainRoute({});
  });

  it('Should return a route configuration object', () => {
    expect(typeof route).to.equal('object');
  });

  describe('Configuration', () => {
    it('Should contain path `/`', () => {
      expect(route.path).to.equal('/');
    });

    it('Should redirect to `/admin` on index route', () => {
      const replace = sinon.spy();
      route.indexRoute.onEnter({}, replace);

      expect(replace.firstCall.args[0]).to.eql('/admin');
    });

    it('Should define a `Admin` child route', () => {
      expect(route.childRoutes[0].path).to.equal(adminRoute({}).path);
    });

    it('Should define a `Auth` child route', () => {
      expect(route.childRoutes[1].path).to.equal(authRoute({}).path);
    });

    it('Should define a `NotFound` child route', () => {
      expect(route.childRoutes[2].path).to.equal('*');
      expect(route.childRoutes[2].component).to.equal(NotFoundLayout);
    });
  });
});
