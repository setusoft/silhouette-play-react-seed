import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Nav } from 'react-bootstrap';
import Header from 'components/Header';
import Unauthenticated from 'components/Header/Unauthenticated';
import config from 'config/index';

describe('(Component) Header/Unauthenticated', () => {
  let current;
  let route;

  const getWrapper = () => shallow(<Unauthenticated current={current} route={route} />);

  beforeEach(() => {
    current = '';
    route = sinon.spy();
  });

  it('Should contain the `Header` as root element', () => {
    expect(getWrapper().first().is(Header)).to.be.true();
  });

  it('Should contain the `Nav` component as child of the `Header` element', () => {
    expect(getWrapper()
      .find(Header)
      .children()
      .first()
      .is(Nav)).to.be.true();
  });

  describe('(Component) Nav', () => {
    it('Should have the class name set to `not-authenticated`', () => {
      expect(getWrapper().find(Nav).props().className).to.equal('not-authenticated');
    });

    it('Should have the `pullRight` prop set to true', () => {
      expect(getWrapper().find(Nav).props().pullRight).to.be.true();
    });

    describe('(Button) Sign-in', () => {
      it('Should be activated on the sign-in page', () => {
        current = config.route.auth.signIn;

        expect(getWrapper().find('.sign-in').get(0).props.active).to.be.true();
      });

      it('Should not be activated on another page', () => {
        current = config.route.auth.signUp;

        expect(getWrapper().find('.sign-in').get(0).props.active).to.be.false();
      });

      it(`Should route to ${config.route.auth.signIn} after select`, () => {
        getWrapper().find('.sign-in').simulate('select');

        expect(route).to.have.been.calledWith(config.route.auth.signIn);
      });
    });

    describe('(Button) Sign-up', () => {
      it('Should be activated on the sign-up page', () => {
        current = config.route.auth.signUp;

        expect(getWrapper().find('.sign-up').get(0).props.active).to.be.true();
      });

      it('Should not be activated on another page', () => {
        current = config.route.auth.signIn;

        expect(getWrapper().find('.sign-up').get(0).props.active).to.be.false();
      });

      it(`Should route to ${config.route.auth.signUp} after select`, () => {
        getWrapper().find('.sign-up').simulate('select');

        expect(route).to.have.been.calledWith(config.route.auth.signUp);
      });
    });
  });
});
