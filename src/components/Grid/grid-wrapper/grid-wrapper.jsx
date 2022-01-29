import React from 'react';
import PropTypes from 'prop-types';
import './grid-wrapper.scoped.css';

const GridWrapper = ({ backgroundImg = "", isEmpty = true, emptyChildren = null, children, ...rest }) => {
  const style = backgroundImg ? {
    backgroundImage: `url(${backgroundImg})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "auto 85%",
  }: {};
  
  return (
    <div style={style} {...rest}>
      {isEmpty ? emptyChildren : children}
    </div>
  )
}

export default GridWrapper;

GridWrapper.propTypes = {
  backgroundImg: PropTypes.string,
  isEmpty: PropTypes.bool,
  emptyChildren: PropTypes.node,
  children: PropTypes.node
}