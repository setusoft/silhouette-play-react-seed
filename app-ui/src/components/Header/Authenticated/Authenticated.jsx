// @flow
import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import FaSignOut from 'react-icons/lib/fa/sign-out';

import Header from '../Header';
import './Authenticated.scss';

type Props = {
  user: Object,
  onSignOut: () => any,
};

export default ({ user, onSignOut }: Props) => (
  <Header>
    <Navbar.Text className="authenticated" pullRight>
      Signed in as: <span>{user.name}</span>
    </Navbar.Text>
    <Nav className="authenticated" pullRight>
      <NavItem className="sign-out" onSelect={onSignOut} title="Sign out">
        <FaSignOut width="25px" height="25px" />
      </NavItem>
    </Nav>
  </Header>
);
