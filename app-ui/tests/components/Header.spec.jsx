import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import Header from 'components/Header';
import Logo from 'components/Header/assets/logo.png';
import FaSignOut from 'react-icons/lib/fa/sign-out';
import config from 'config/index';

describe('(Component) Header', () => {
  let current;
  let user;
  let route;
  let onSignOut;
  let children;
  let wrapper;

  const getWrapper = () => shallow(
    <Header
      current={current}
      user={user}
      route={route}
      onSignOut={onSignOut}
    >{children}</Header>
  );

  beforeEach(() => {
    current = '';
    user = {};
    route = sinon.spy();
    onSignOut = sinon.spy();
    wrapper = getWrapper();
  });

  it('Should contain the company icon', () => {
    expect(wrapper.contains(
      <img src={Logo} width="30px" height="30px" alt="Silhouette Play React Seed Template" />
    )).to.be.true();
  });

  it('Should be possible to inject additional navigation points', () => {
    children = (
      <Nav>
        <NavItem eventKey={1} href="/route1">NavItem 1</NavItem>
        <NavItem eventKey={2} href="/route2">NavItem 2</NavItem>
      </Nav>
    );

    wrapper = getWrapper();

    expect(wrapper.contains(children)).to.be.true();
  });

  describe('(Component) Navbar', () => {
    it('Should have prop `fluid` set to true', () => {
      expect(wrapper.find(Navbar).get(0).props.fluid).to.be.true();
    });

    it('Should have prop `fixedTop` set to true', () => {
      expect(wrapper.find(Navbar).get(0).props.fixedTop).to.be.true();
    });

    it('Should have prop `inverse` set to true', () => {
      expect(wrapper.find(Navbar).get(0).props.inverse).to.be.true();
    });

    it('Should have prop `id` set to "header"', () => {
      expect(wrapper.find(Navbar).get(0).props.id).to.equal('header');
    });

    describe('Signed-in state', () => {
      it('Should be rendered if the user is signed in', () => {
        user = { name: 'John Doe' };
        wrapper = getWrapper();

        expect(wrapper.find('.authenticated')).to.have.length(2);
        expect(wrapper.find('.not-authenticated')).to.have.length(0);
      });

      it('Should render the user name', () => {
        user = { name: 'John Doe' };
        wrapper = getWrapper();

        expect(wrapper.contains(
          <Navbar.Text className="authenticated" pullRight>
            Signed in as: <span>{user.name}</span>
          </Navbar.Text>
        )).to.be.true();
      });

      describe('(Button) Sign-out', () => {
        it('Should render the logout icon', () => {
          user = { name: 'John Doe' };
          wrapper = getWrapper();

          expect(wrapper.contains(
            <FaSignOut width="25px" height="25px" />
          )).to.be.true();
        });

        it('Should execute the `onSignOut` handler on click', () => {
          user = { name: 'John Doe' };
          wrapper = getWrapper();

          wrapper.find('.sign-out').simulate('select');

          onSignOut.should.have.been.calledOnce();
        });
      });
    });

    describe('Signed-out state', () => {
      it('Should be rendered if the user is signed out', () => {
        user = {};
        wrapper = getWrapper();

        expect(wrapper.find('.not-authenticated')).to.have.length(1);
        expect(wrapper.find('.authenticated')).to.have.length(0);
      });

      describe('(Button) Sign-in', () => {
        it('Should be activated on the sign-in page', () => {
          user = {};
          current = config.route.auth.signIn;
          wrapper = getWrapper();

          expect(wrapper.find('.sign-in').get(0).props.active).to.be.true();
        });

        it('Should not be activated on another page', () => {
          user = {};
          current = config.route.auth.signUp;
          wrapper = getWrapper();

          expect(wrapper.find('.sign-in').get(0).props.active).to.be.false();
        });

        it(`Should route to ${config.route.auth.signIn} after select`, () => {
          wrapper.find('.sign-in').simulate('select');

          expect(route).to.have.been.calledWith(config.route.auth.signIn);
        });
      });

      describe('(Button) Sign-up', () => {
        it('Should be activated on the sign-up page', () => {
          user = {};
          current = config.route.auth.signUp;
          wrapper = getWrapper();

          expect(wrapper.find('.sign-up').get(0).props.active).to.be.true();
        });

        it('Should not be activated on another page', () => {
          user = {};
          current = config.route.auth.signIn;
          wrapper = getWrapper();

          expect(wrapper.find('.sign-up').get(0).props.active).to.be.false();
        });

        it(`Should route to ${config.route.auth.signUp} after select`, () => {
          wrapper.find('.sign-up').simulate('select');

          expect(route).to.have.been.calledWith(config.route.auth.signUp);
        });
      });
    });
  });
});
