
import React from 'react';
import PropTypes from 'prop-types';
import './GridWrapper.css';

const GridWrapper = ({children}) => (

    <div className="grid-container">
      {children}
    </div>
)

export default GridWrapper;

GridWrapper.propTypes = {
  children: PropTypes.node
}