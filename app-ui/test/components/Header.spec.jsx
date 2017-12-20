import React from 'react';
import { shallow } from 'enzyme';
import { Navbar } from 'react-bootstrap';
import Header from 'components/Header';
import Logo from 'components/Header/assets/logo.png';

describe('(Component) Header', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Header><div className="children" /></Header>);
  });

  it('Should contain the company logo', () => {
    const logo = <img src={Logo} width="30px" height="30px" alt="Silhouette Play React Seed Template" />;

    expect(wrapper.contains(logo)).to.be.true();
  });

  it('Should render the children', () => {
    expect(wrapper.contains(<div className="children" />)).to.be.true();
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
  });
});
