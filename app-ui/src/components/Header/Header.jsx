// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';

import type { Node } from 'react';

import Logo from './assets/logo.png';
import './Header.scss';

type Props = {
  children: Node,
};

export default ({ children }: Props) => (
  <Navbar fluid fixedTop inverse id="header">
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/"><img src={Logo} width="30px" height="30px" alt="Silhouette Play React Seed Template" /></Link>
      </Navbar.Brand>
    </Navbar.Header>
    {children}
  </Navbar>
);
