import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './navbar-item.css';

const Label = ({ text }) => (
    <p className="navbar__itemlabel">{text}</p>
)

const NotificationIcon = ({ icon, count = 0 }) => {

    if (count === 0) {
        return <img src={icon} />;
    }

    return (
        <div className="notification-wrapper">
            <img src={icon} />
            <div className="notification-indicator">
                <div className="notification-count" role="status">
                    {count > 99 ? '+99' : count}
                </div>
            </div>
        </div>
    )
}

const NavbarItem = ({ path, label, icon, count, onClick = undefined }) => (
    <li className="navbar__item">
        <Link to={path} onClick={onClick}>
            <NotificationIcon icon={icon} count={count} />
            <Label text={label} />
        </Link>
    </li>
)

export default NavbarItem;

Label.propTypes = {
    text: PropTypes.string.isRequired
}

NotificationIcon.propTypes = {
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