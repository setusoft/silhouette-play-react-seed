import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Nav, Navbar } from 'react-bootstrap';
import Header from 'components/Header';
import Authenticated from 'components/Header/Authenticated';
import FaSignOut from 'react-icons/lib/fa/sign-out';

describe('(Component) Header/Authenticated', () => {
  let user;
  let onSignOut;

  const getWrapper = () => shallow(<Authenticated user={user} onSignOut={onSignOut} />);

  beforeEach(() => {
    user = {};
    onSignOut = sinon.spy();
  });

  it('Should contain the `Header` as root element', () => {
    expect(getWrapper().first().is(Header)).to.be.true();
  });

  it('Should render the user name', () => {
    user = { name: 'John Doe' };

    const username = (
      <Navbar.Text className="authenticated" pullRight>
        Signed in as: <span>{user.name}</span>
      </Navbar.Text>
    );

    expect(getWrapper().contains(username)).to.be.true();
  });

  describe('(Component) Nav', () => {
    it('Should have the class name set to `not-authenticated`', () => {
      expect(getWrapper().find(Nav).props().className).to.equal('authenticated');
    });

    it('Should have the `pullRight` prop set to true', () => {
      expect(getWrapper().find(Nav).props().pullRight).to.be.true();
    });

    describe('(Button) Sign-out', () => {
      it('Should render the logout icon', () => {
        user = { name: 'John Doe' };

        expect(getWrapper().contains(<FaSignOut width="25px" height="25px" />)).to.be.true();
      });

      it('Should execute the `onSignOut` handler on click', () => {
        user = { name: 'John Doe' };

        getWrapper().find('.sign-out').simulate('select');

        onSignOut.should.have.been.calledOnce();
      });
    });
  });
});
