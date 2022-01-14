import React from 'react';
import PropTypes from 'prop-types';
import './NavbarList.css';
import propTypes from 'prop-types';

const NavbarList = ({ children }) => (
    <ul className="navbar__list">
        {children}
    </ul>
)

export default NavbarList;

NavbarList.propTypes = {
    children: propTypes.any.isRequired
}