import React from 'react';
import PropTypes from 'prop-types';
import './navbar-list.scoped.css';
import propTypes from 'prop-types';

const NavbarList = ({ children }) => (
    <ul>
        {children}
    </ul>
)

export default NavbarList;

NavbarList.propTypes = {
    children: propTypes.any.isRequired
}