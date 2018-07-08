import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Nav, Navbar } from 'react-bootstrap';
import Header from 'components/Header';
import Authenticated from 'components/Header/Authenticated';
import FaSignOut from 'react-icons/lib/fa/sign-out';

describe('(Component) Header/Authenticated', () => {
  const wrapper = ({ userName = '', onSignOut = () => null } = {}) => shallow(
    <Authenticated userName={userName} onSignOut={onSignOut} />,
  );

  it('Should contain the `Header` as root element', () => {
    expect(wrapper().first().is(Header)).to.be.true();
  });

  it('Should render the user name', () => {
    const userName = 'John Doe';

    const container = (
      <Navbar.Text className="authenticated" pullRight>
        Signed in as:
        {' '}
        <span>
          {userName}
        </span>
      </Navbar.Text>
    );

    expect(wrapper({ userName }).contains(container)).to.be.true();
  });

  describe('(Component) Nav', () => {
    it('Should have the class name set to `not-authenticated`', () => {
      expect(wrapper().find(Nav).props().className).to.equal('authenticated');
    });

    it('Should have the `pullRight` prop set to true', () => {
      expect(wrapper().find(Nav).props().pullRight).to.be.true();
    });

    describe('(Button) Sign-out', () => {
      it('Should render the logout icon', () => {
        expect(wrapper().contains(<FaSignOut width="25px" height="25px" />)).to.be.true();
      });

      it('Should execute the `onSignOut` handler on click', () => {
        const onSignOut = sinon.spy();

        wrapper({ onSignOut }).find('.sign-out').simulate('select');

        onSignOut.should.have.been.calledOnce();
      });
    });
  });
});
