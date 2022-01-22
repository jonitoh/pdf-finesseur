
import React from 'react';
import PropTypes from 'prop-types';
import './grid.css';
import GridWrapper from './grid-wrapper/grid-wrapper';
import { TwoClickCard as DummyCard } from '../card/dummy-card/dummy-card';
import { useStore } from '../../store';

const Grid = ({ CardComponent = DummyCard, fBasis = '25%' }) => {
  // items to be populated in the grid
  const {
    documents: items,
    deletedPages,
    removePagesByDocumentFromAvailablePages,
    removePagesByDocumentFromDeletedPages,
    removeDocument,
    addAvailablePage,
    removePageByIdFromDeletedPages,
  } = useStore();

  // remove document forever
  const removeFromGrid = itemId => {
    console.log(`WE are TRYING TO REMOVE A CARD WITH THE ID ${itemId}`)
    removeDocument(itemId);
    removePagesByDocumentFromDeletedPages(itemId);
    //removePagesByDocumentFromAvailablePages(itemId);
  }

  // restaurer à la chaine
  const restoreAll = itemId => {
    console.log(`restore all the pages from the item ${itemId}`);
    [ ...deletedPages]
    .filter(page => page.parentId === itemId)
    .forEach(page => {
      addAvailablePage(page);
      removePageByIdFromDeletedPages(page.id);

    })
    
  }

  // in order to customize the number of rows
  const customStyle = { flexBasis: fBasis };

  //SimpleCard
  const renderCard = item => (
    <CardComponent {...{
      text: item.name,
      firstLabel: "Remove All",
      firstOnClick: () => removeFromGrid(item.id),
      secondLabel: "Restore All",
      secondOnClick: () => restoreAll(item.id)
    }} />
  );

  return (
    <GridWrapper>
      {items.map(item => (
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
  items: PropTypes.array,
  CardComponent: PropTypes.elementType,
  fBasis: PropTypes.string
}