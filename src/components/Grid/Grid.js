
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Grid.css';
import DummyCard from '../Card/DummyCard/DummyCard';

const _items = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Grid = ({ CardComponent = DummyCard, fBasis = '25%' }) => {
  // items to be populated in the grid
  const [items, setItems] = useState(_items);

  const removeFromGrid = (index) => {
    console.log(`WE are TRYING TO REMOVE A CARD WITH THE INDEX ${index}`)
    const filteredItems = items.filter((val, idx) => idx != index)
    setItems(filteredItems)
  }
  // in order to customize the number of rows
  const customStyle = { flexBasis: fBasis };

  return (
    <div className="grid-container">
      {items.map((item, index) => (
        <div className="grid-item-wrapper" key={index} style={customStyle}>
          <div className="grid-item card">
            <CardComponent {...{ text: `${item}`, onClick: () => removeFromGrid(index) }} />
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