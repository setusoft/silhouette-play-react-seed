import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import FaSignOut from 'react-icons/lib/fa/sign-out';
import config from 'config/index';

import Logo from './assets/logo.png';
import './Header.scss';

const Header = ({
  current, user, route, onSignOut, children,
}) => (
  <Navbar fluid fixedTop inverse id="header">
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/"><img src={Logo} width="30px" height="30px" alt="Silhouette Play React Seed Template" /></Link>
      </Navbar.Brand>
    </Navbar.Header>
    {children || ''}
    {isEmpty(user) ? (
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
    ) : (
      <div>
        <Navbar.Text className="authenticated" pullRight>
          Signed in as: <span>{user.name}</span>
        </Navbar.Text>
        <Nav className="authenticated" pullRight>
          <NavItem className="sign-out" onSelect={onSignOut} title="Sign out">
            <FaSignOut width="25px" height="25px" />
          </NavItem>
        </Nav>
      </div>
    )}
  </Navbar>
);

Header.propTypes = {
  current: PropTypes.string.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  route: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Header.defaultProps = {
  children: [],
};

export default Header;
