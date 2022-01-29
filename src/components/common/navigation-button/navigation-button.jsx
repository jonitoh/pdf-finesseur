import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './navigation-button.scoped.css';

const NavigationButton = ({ path, Icon, onClick = undefined, iconProps = {}, children, ...rest }) => (
    <div { ...rest}>
        <Link to={path} onClick={onClick}>
            <Icon {...iconProps}/>
            {children}
        </Link>
    </div>
)

NavigationButton.propTypes = {
    path: PropTypes.string.isRequired,
    Icon: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    iconProps: PropTypes.object,
    children: PropTypes.node,
    rest: PropTypes.object,
}

export default NavigationButton;
