import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Nav } from 'react-bootstrap';
import Header from 'components/Header';
import Unauthenticated from 'components/Header/Unauthenticated';
import config from 'config/index';

describe('(Component) Header/Unauthenticated', () => {
  const wrapper = ({ current = '', route = () => null } = {}) =>
    shallow(<Unauthenticated current={current} route={route} />);

  it('Should contain the `Header` as root element', () => {
    expect(wrapper().first().is(Header)).to.be.true();
  });

  it('Should contain the `Nav` component as child of the `Header` element', () => {
    expect(wrapper()
      .find(Header)
      .children()
      .first()
      .is(Nav)).to.be.true();
  });

  describe('(Component) Nav', () => {
    it('Should have the class name set to `not-authenticated`', () => {
      expect(wrapper().find(Nav).props().className).to.equal('not-authenticated');
    });

    it('Should have the `pullRight` prop set to true', () => {
      expect(wrapper().find(Nav).props().pullRight).to.be.true();
    });

    describe('(Button) Sign-in', () => {
      it('Should be activated on the sign-in page', () => {
        const current = config.route.auth.signIn;

        expect(wrapper({ current }).find('.sign-in').get(0).props.active).to.be.true();
      });

      it('Should not be activated on another page', () => {
        const current = config.route.auth.signUp;

        expect(wrapper({ current }).find('.sign-in').get(0).props.active).to.be.false();
      });

      it(`Should route to ${config.route.auth.signIn} after select`, () => {
        const route = sinon.spy();

        wrapper({ route }).find('.sign-in').simulate('select');

        expect(route).to.have.been.calledWith(config.route.auth.signIn);
      });
    });

    describe('(Button) Sign-up', () => {
      it('Should be activated on the sign-up page', () => {
        const current = config.route.auth.signUp;

        expect(wrapper({ current }).find('.sign-up').get(0).props.active).to.be.true();
      });

      it('Should not be activated on another page', () => {
        const current = config.route.auth.signIn;

        expect(wrapper({ current }).find('.sign-up').get(0).props.active).to.be.false();
      });

      it(`Should route to ${config.route.auth.signUp} after select`, () => {
        const route = sinon.spy();

        wrapper({ route }).find('.sign-up').simulate('select');

        expect(route).to.have.been.calledWith(config.route.auth.signUp);
      });
    });
  });
});
