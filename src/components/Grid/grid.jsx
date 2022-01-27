// à jeter ?
import React from 'react';
import PropTypes from 'prop-types';
import './grid.css';
import GridWrapper from './grid-wrapper/grid-wrapper';
import { SimpleCard as DummyCard } from '../card/dummy-card/dummy-card';
import { useStore } from '../../store';

const Grid = ({ CardComponent = DummyCard, fBasis = '25%' }) => {
  // items to be populated in the grid
  const {
    availablePages: gridItems,
    removePageByIdFromAvailablePages,
    addDeletedPage,
  } = useStore();

  const removeFromGrid = itemId => {
    console.log(`WE are TRYING TO REMOVE A CARD WITH THE ID ${itemId}`)
    const removedItem = gridItems.find(item => item.id === itemId);
    removePageByIdFromAvailablePages(itemId);
    if (removedItem) {
      addDeletedPage(removedItem);
    }
  }
  // in order to customize the number of rows
  const customStyle = { flexBasis: fBasis };

  //SimpleCard
  const renderCard = item => (
    <CardComponent {...{
      text: item.name,
      onClick: () => removeFromGrid(item.id),
      modalText: `modal msg for item ${item.name}`
    }} />
  );

  return (
    <GridWrapper>
      {gridItems.map(item => (
        <div className="grid-item-wrapper" key={item.id} style={customStyle}>
          <div className="grid-item card">
            {renderCard(item)}
          </div>
        </div>))}
    </GridWrapper>
  )
}

export default Grid;

Grid.propTypes = {
  CardComponent: PropTypes.elementType,
  fBasis: PropTypes.string
}