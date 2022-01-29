import React from 'react';
import { Link } from 'react-router-dom';
import NavigationButton from '@common/navigation-button/navigation-button';
import PropTypes from 'prop-types';
import './navbar-item.scoped.css';

const Label = ({ text }) => (
    <p className="label">{text}</p>
)

const NavbarItem = ({ path, label, Icon, count, onClick = undefined }) => (
    <li>
        <NavigationButton
            path={path}
            Icon={Icon}
            onClick={onClick}
            iconProps={{ notificationCount: count }}
        >
            <Label text={label} />
        </NavigationButton>
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
