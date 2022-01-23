
import React from 'react';
import PropTypes from 'prop-types';
import './grid-wrapper.css';

const GridWrapper = ({children}) => (

    <div className="grid-container container">
      {children}
    </div>
)

export default GridWrapper;

GridWrapper.propTypes = {
  children: PropTypes.node
}