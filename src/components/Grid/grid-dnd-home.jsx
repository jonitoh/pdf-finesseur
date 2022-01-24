import React from 'react';
import './grid.css';
//import './styles.css';
import GridWrapper from './grid-wrapper/grid-wrapper';
import { useStore } from '../../store';
import { Item, ItemDragLayer } from "../dnd/dnd-elements/dnd-elements";
import PropTypes from 'prop-types';

const Grid = ({ fBasis = '25%' }) => {
  // in order to customize the number of rows
  const customStyle = { flexBasis: fBasis };

  // items to be populated in the grid
  const {
    availablePages: __items,
    removePageByIdFromAvailablePages,
    addDeletedPage,
    ...state
  } = useStore();

  // all the main functionalities a grid need to handle a card
  const removeItemSelection = itemId => {
    console.log(`WE are TRYING TO REMOVE A CARD WITH THE ID ${itemId}`)
    const removedItems = state.items.filter(item => item.id === itemId);
    // it's easier to do it through pages
    removePageByIdFromAvailablePages(itemId);
    if (removedItems.length > 0) {
      addDeletedPage(removedItems[0]);
    }
  }

  const clearItemSelection = () => {
    state.clearSelection();
  };

  const handleItemSelection = (index, cmdKey, shiftKey) => {
    let newselectedItems;
    const items = state.items;
    const item = index < 0 ? "" : items[index];
    const newLastSelectedIndex = index;

    if (!cmdKey && !shiftKey) {
      newselectedItems = [item];
    } else if (shiftKey) {
      if (state.dnd.lastSelectedIndex >= index) {
        newselectedItems = [].concat.apply(
          state.dnd.selectedItems,
          items.slice(index, state.dnd.lastSelectedIndex)
        );
      } else {
        newselectedItems = [].concat.apply(
          state.dnd.selectedItems,
          items.slice(state.dnd.lastSelectedIndex + 1, index + 1)
        );
      }
    } else if (cmdKey) {
      const foundIndex = state.dnd.selectedItems.findIndex((f) => f === item);
      // If found remove it to unselect it.
      if (foundIndex >= 0) {
        newselectedItems = [
          ...state.dnd.selectedItems.slice(0, foundIndex),
          ...state.dnd.selectedItems.slice(foundIndex + 1)
        ];
      } else {
        newselectedItems = [...state.dnd.selectedItems, item];
      }
    }
    const finalList = items
      ? items.filter((f) => newselectedItems.find((a) => a === f))
      : [];
    state.updateSelection(finalList, newLastSelectedIndex)
    /*{
      newselectedItems: finalList,
      newLastSelectedIndex: newLastSelectedIndex
    }*/
  };

  const rearrangeItems = (dragItem) => {
    let items = state.items.slice();
    const draggedItems = dragItem.items;

    let dividerIndex;
    if ((state.dnd.insertIndex >= 0) & (state.dnd.insertIndex < items.length)) {
      dividerIndex = state.dnd.insertIndex;
    } else {
      // If missing insert index, put the dragged items to the end of the queue
      dividerIndex = items.length;
    }
    const upperHalfRemainingItems = items
      .slice(0, dividerIndex)
      .filter((i) => !draggedItems.find((di) => di.id === i.id));
    const lowerHalfRemainingItems = items
      .slice(dividerIndex)
      .filter((i) => !draggedItems.find((di) => di.id === i.id));
    const newItems = [
      ...upperHalfRemainingItems,
      ...draggedItems,
      ...lowerHalfRemainingItems
    ];
    state.rearrangeItems(newItems);//{ items: newItems }
  };

  const setInsertIndex = (dragIndex, hoverIndex, newInsertIndex) => {
    if (
      state.dnd.dragIndex === dragIndex &&
      state.dnd.hoverIndex === hoverIndex &&
      state.dnd.insertIndex === newInsertIndex
    ) {
      return;
    }
    state.setInsertIndex(dragIndex, hoverIndex, newInsertIndex);
    /*{
      dragIndex: dragIndex,
      hoverIndex: hoverIndex,
      insertIndex: newInsertIndex
    }*/
  };

  return (
    <GridWrapper>
      <ItemDragLayer />
      
        {state
          .items
          .map((item, i) => {
            const insertLineOnLeft =
              state.dnd.hoverIndex === i && state.dnd.insertIndex === i;
            const insertLineOnRight =
              state.dnd.hoverIndex === i && state.dnd.insertIndex === i + 1;
            return (
              <Item
                key={"item-" + item.id}
                id={item.id}
                index={i}
                order={item.order}
                selectedItems={state.dnd.selectedItems}
                rearrangeItems={rearrangeItems}
                setInsertIndex={setInsertIndex}
                onSelectionChange={handleItemSelection}
                clearItemSelection={clearItemSelection}
                isSelected={state.dnd.selectedItems.includes(item)}
                insertLineOnLeft={insertLineOnLeft}
                insertLineOnRight={insertLineOnRight}
                style={customStyle}
                item={item}
                removeItemSelection={removeItemSelection}
              />
            );
          })}
      </GridWrapper>
  );
}

export default Grid;

Grid.propTypes = {
  fBasis: PropTypes.string
}