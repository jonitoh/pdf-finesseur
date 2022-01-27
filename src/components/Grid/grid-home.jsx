import React, { Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import './grid.css';
import GridWrapper from './grid-wrapper/grid-wrapper';
import { TwoClickCard as DummyCard } from '../card/dummy-card/dummy-card';
import { useStore } from '../../store';
import Modal from '../modal/modal';

const Grid = ({ CardComponent = DummyCard, fBasis = '25%' }) => {
  // in order to customize the number of rows
  const customStyle = { flexBasis: fBasis };

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

  //SimpleCard
  const Card = ({item, modal}) => (
    <CardComponent {...{
      text: item.name,
      firstOnClick: () => removeFromGrid(item.id),
      firstLabel: "remove",
      secondOnClick: () => modal.current.open(),
      secondLabel: 'modal',
    }} />
  );

  // Big Card 
  const BigCard = ({item, ...rest}) => {
    const modal = useRef(null);

    return (
      <Fragment>
          <Modal
            defaultOpened={false}
            allowHandleEscape={false}
            title={""}
            fade={false}
            ref={modal}
          >
            {`modal msg for item ${item.name}`}
          </Modal>
          <Card item={item} modal={modal} />
      </Fragment>
    )
  }


  return (
    <GridWrapper>
      {gridItems.map(item => (
        <div className="grid-item-wrapper" key={item.id} style={customStyle}>
          <div className="grid-item card">
            <BigCard item={item}/>
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