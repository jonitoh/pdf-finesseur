import React from 'react';
import PropTypes from 'prop-types';

// 
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
