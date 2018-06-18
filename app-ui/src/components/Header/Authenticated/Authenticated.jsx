// @flow
import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import FaSignOut from 'react-icons/lib/fa/sign-out';

import Header from '../Header';
import './Authenticated.scss';

type Props = {
  userName: string,
  onSignOut: () => any,
};

export default ({ userName, onSignOut }: Props) => (
  <Header>
    <Navbar.Text className="authenticated" pullRight>
      Signed in as: <span>{userName}</span>
    </Navbar.Text>
    <Nav className="authenticated" pullRight>
      <NavItem className="sign-out" onSelect={onSignOut} title="Sign out">
        <FaSignOut width="25px" height="25px" />
      </NavItem>
    </Nav>
  </Header>
);
