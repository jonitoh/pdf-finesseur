
import React from 'react';
import PropTypes from 'prop-types';
import './grid.css';
import GridWrapper from './grid-wrapper/grid-wrapper';
import DummyCard from '../card/dummy-card/dummy-card';
import { useStore } from '../../store';

const Grid = ({ CardComponent = DummyCard, fBasis = '25%' }) => {
  // items to be populated in the grid
  const { 
    availablePages: items,
    removePageByIdFromAvailablePages,
    addDeletedPage,
  } = useStore();
  
  const removeFromGrid = itemId => {
    console.log(`WE are TRYING TO REMOVE A CARD WITH THE ID ${itemId}`)
    const removedItems = items.filter(item => item.id === itemId);
    removePageByIdFromAvailablePages(itemId);
    if (removedItems.length > 0) {
      addDeletedPage(removedItems[0]);
    }  
  }
  // in order to customize the number of rows
  const customStyle = { flexBasis: fBasis };

  return (
    <GridWrapper>
      {items.map(item => (
        <div className="grid-item-wrapper" key={item.id} style={customStyle}>
          <div className="grid-item card">
            <CardComponent {...{ text: item.name, onClick: () => removeFromGrid(item.id) }} />
          </div>
        </div>))}
    </GridWrapper>
  )
}

export default Grid;

Grid.propTypes = {
  items: PropTypes.array,
  CardComponent: PropTypes.elementType,
  fBasis: PropTypes.string
}