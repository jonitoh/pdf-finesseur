import React from 'react';
import PropTypes from 'prop-types';
import './grid.css';
import GridWrapper from './grid-wrapper/grid-wrapper';
import { OneClickCard as DummyCard } from '../card/dummy-card/dummy-card';
import { useStore } from '../../store';

const Grid = ({ CardComponent = DummyCard, fBasis = '25%' }) => {
  // items to be populated in the grid
  const {
    deletedPages: gridItems,
    removePageByIdFromDeletedPages,
    addAvailablePage
  } = useStore();

  // removeFromGrid aka restaurer aka remove deleted page and add into available pages
  const removeFromGrid = itemId => {
    console.log(`WE are TRYING TO RESTORE A CARD WITH THE ID ${itemId}`)
    const removedItem = gridItems.find(item => item.id === itemId);
    removePageByIdFromDeletedPages(itemId);
    if (removedItem) {
      addAvailablePage(removedItem);
    }
  }
  // in order to customize the number of rows
  const customStyle = { flexBasis: fBasis };

  //SimpleCard
  const renderCard = item => (
    <CardComponent {...{
      text: item.name,
      onClick: () => removeFromGrid(item.id),
      clickLabel: "restore"
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