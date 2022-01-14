
import React from 'react';
import PropTypes from 'prop-types';
import './Grid.css';

const DummyComponent = ({a}) => (<div>{a}</div>);
const _items = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Grid = ({items = _items, CardComponent = DummyComponent, fBasis = '25%'}) => {
  const customStyle = { flexBasis : fBasis };

  return (
    <div className="grid-container">
      {items.map((item, index) => (
        <div className="grid-item-wrapper" key={index} style={customStyle}>
          <div className="grid-item card">
            <CardComponent {...{a: item}}/>
          </div>
        </div>))}
    </div>
  )
}


export default Grid;

Grid.propTypes = {
  items: PropTypes.array,
  CardComponent: PropTypes.elementType,
  fBasis: PropTypes.string
}