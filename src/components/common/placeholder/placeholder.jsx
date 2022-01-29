import React from 'react';
import PropTypes from 'prop-types';
import './placeholder.scoped.css';

const Placeholder = ({children}) => (
        <div>
            {children}
        </div>
)

export default Placeholder;

Placeholder.propTypes = {
    children: PropTypes.any.isRequired
}