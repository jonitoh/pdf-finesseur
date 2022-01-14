import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './NavbarItem.css';

const Label = ({ text }) => (
    <p className="navbar__itemlabel">{text}</p>
)

const Notification = ({ icon, count = 0 }) => (
    <div className="notification-wrapper">
        <img src={icon} />
        <div className="notification-indicator">
            <div className="notification-count" role="status">
                {count}
            </div>
        </div>
    </div>
)

const NavbarItem = ({ path, label, icon, count, onClick = undefined }) => (
    <li className="navbar__item">
        <Link to={path} onClick={onClick}>
            {count > 0 ?
                <Notification icon={icon} count={count} /> :
                null}
            <Label text={label} />
        </Link>
    </li>
)

export default NavbarItem;

Label.propTypes = {
    text: PropTypes.string.isRequired
}

Notification.propTypes = {
    icon: PropTypes.string.isRequired,
    count: PropTypes.number,
}

NavbarItem.propTypes = {
    path: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    count: PropTypes.number,
    onClick: PropTypes.func,
}