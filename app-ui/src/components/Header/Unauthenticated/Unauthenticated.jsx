// @flow
import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import config from 'config/index';

import Header from '../Header';

type Props = {
  route: (string) => any,
  current: string,
};

export default ({ route, current }: Props) => (
  <Header>
    <Nav className="not-authenticated" pullRight>
      <NavItem
        className="sign-in"
        onSelect={() => route(config.route.auth.signIn)}
        active={current === config.route.auth.signIn}
      >
        SignIn
      </NavItem>
      <NavItem
        className="sign-up"
        onSelect={() => route(config.route.auth.signUp)}
        active={current === config.route.auth.signUp}
      >
        SignUp
      </NavItem>
    </Nav>
  </Header>
);
