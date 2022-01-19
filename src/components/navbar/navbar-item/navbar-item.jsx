import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './navbar-item.css';

const Label = ({ text }) => (
    <p className="navbar__itemlabel">{text}</p>
)

const NavbarItem = ({ path, label, Icon, count, onClick = undefined }) => (
    <li className="navbar__item">
        <Link to={path} onClick={onClick} >
            <Icon notificationCount={count} />
            <Label text={label} />
        </Link>
    </li>
)

export default NavbarItem;

Label.propTypes = {
    text: PropTypes.string.isRequired
}

NavbarItem.propTypes = {
    path: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    Icon: PropTypes.func,
    count: PropTypes.number,
    onClick: PropTypes.func,
}
