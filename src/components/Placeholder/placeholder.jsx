import React from 'react';
import PropTypes from 'prop-types';
import './placeholder.css';

const Placeholder = ({children}) => (
        <div className="app__placeholder">
            {children}
        </div>
)

export default Placeholder;

Placeholder.propTypes = {
    children: PropTypes.any.isRequired
}