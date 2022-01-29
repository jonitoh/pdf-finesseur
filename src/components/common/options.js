import React from 'react';
import PropTypes from 'prop-types';

// Show the tag in the DOM
const withOptionalShow = (Component) => (
    ({ show = true, ...props }) => {
        if (!show) {
            return null;
        }
        return (
            <Component {...props} />
        )
    }
)

export {
    withOptionalShow
}
