import React from 'react';
import PropTypes from 'prop-types';
import './grid-item-wrapper.scoped.css';

const GridItemWrapper = ({ wrapperStyle = {}, children }) => (
    <div className="wrapper" style={wrapperStyle}>
        <div className="item">
            {children}
        </div>
    </div>
)

export default GridItemWrapper;

GridItemWrapper.propTypes = {
    wrapperStyle: PropTypes.object,
    children: PropTypes.node
}
