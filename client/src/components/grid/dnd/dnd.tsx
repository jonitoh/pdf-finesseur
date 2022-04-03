import React, { CSSProperties, Fragment } from 'react';
import List, { Props as ListProps } from '#components/grid/list/list';
import select, { Store as State } from '#store';
import { calculateFlexBasis } from '#/utils/main';
import { DNDItem } from '#/services/item-and-element';
import Item, { DragObject, Props as ItemProps } from '#components/dnd/home/item';
import ItemDragLayer, { Props as ItemDragLayerProps } from '#components/dnd/home/drag-layer';
import styles from './dnd.module.css';

const firstSelector = (state: State) => ({
  addDeletedPageByIdFromAvailablePages: state.addDeletedPageByIdFromAvailablePages,
});

const secondSelector = (state: State) => ({
  items: state.items,
  dnd: state.dnd,
  updateSelection: state.updateSelection,
  rearrangeItems: state.rearrangeItems,
  setInsertIndex: state.setInsertIndex,
  clearSelection: state.clearSelection,
});

export type Props = {
  propsForList?: Omit<ListProps, 'children'>; // children is already given
  propsForItem?: ItemProps;
  propsForDraggedItem?: ItemDragLayerProps;
  flexBasis?: CSSProperties['flexBasis'];
};

export default function GridDND({
  propsForList,
  propsForItem,
  propsForDraggedItem,
  flexBasis,
}: Props) {
  // items to be populated in the grid
  const { addDeletedPageByIdFromAvailablePages } = select(firstSelector);
  const state = select(secondSelector);

  // all the main dnd functionalities a grid needs to handle an item
  function removeItem(itemId: string) {
    console.info(`WE are TRYING TO REMOVE A PAGE WITH THE ID ${itemId}`);
    addDeletedPageByIdFromAvailablePages(itemId);
  }

  function clearItemSelection() {
    state.clearSelection();
  }

  function handleItemSelection(index: number, hasCmdKey: boolean, hasShiftKey: boolean) {
    let newselectedItems: DNDItem[];
    const { items } = state;
    const item = index < 0 ? undefined : items[index];
    const newLastSelectedIndex = index;

    if (!hasCmdKey && !hasShiftKey) {
      newselectedItems = item ? [item] : [];
    } else if (hasShiftKey) {
      if (state.dnd.lastSelectedIndex >= index) {
        newselectedItems = [
          ...state.dnd.selectedItems,
          ...items.slice(index, state.dnd.lastSelectedIndex),
        ];
      } else {
        newselectedItems = [
          ...state.dnd.selectedItems,
          ...items.slice(state.dnd.lastSelectedIndex + 1, index + 1),
        ];
      }
    } else if (hasCmdKey) {
      const foundIndex = state.dnd.selectedItems.findIndex((f) => f === item);
      // If found remove it to unselect it.
      if (foundIndex >= 0) {
        newselectedItems = [
          ...state.dnd.selectedItems.slice(0, foundIndex),
          ...state.dnd.selectedItems.slice(foundIndex + 1),
        ];
      } else {
        newselectedItems = item ? [...state.dnd.selectedItems, item] : [...state.dnd.selectedItems];
      }
    }
    const finalList = items ? items.filter((f) => newselectedItems.find((a) => a === f)) : [];
    state.updateSelection(finalList, newLastSelectedIndex);
  }

  function rearrangeItems(dragObject: DragObject) {
    const items = state.items.slice();
    const draggedItems = dragObject.items;

    let dividerIndex;
    if (state.dnd.insertIndex >= 0 && state.dnd.insertIndex < items.length) {
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
    const newItems = [...upperHalfRemainingItems, ...draggedItems, ...lowerHalfRemainingItems];
    state.rearrangeItems(newItems);
  }

  function setInsertIndex(dragIndex: number, hoverIndex: number, newInsertIndex: number) {
    if (
      state.dnd.dragIndex === dragIndex &&
      state.dnd.hoverIndex === hoverIndex &&
      state.dnd.insertIndex === newInsertIndex
    ) {
      return;
    }
    state.setInsertIndex(dragIndex, hoverIndex, newInsertIndex);
  }

  // in order to customize the number of rows
  const style = flexBasis ? { flexBasis: calculateFlexBasis(flexBasis) } : {};

  function renderItem(item: DNDItem, index: number) {
    const shouldInsertLineOnLeft =
      state.dnd.hoverIndex === index && state.dnd.insertIndex === index;
    const shouldInsertLineOnRight =
      state.dnd.hoverIndex === index && state.dnd.insertIndex === index + 1;

    return (
      <Fragment key={`item-${item.id}`}>
        <ItemDragLayer {...{ ...propsForDraggedItem, ...{ item } }} />
        <Item
          index={index}
          isSelected={state.dnd.selectedItems.includes(item)}
          shouldInsertLineOnLeft={shouldInsertLineOnLeft}
          shouldInsertLineOnRight={shouldInsertLineOnRight}
          item={item}
          selectedItems={state.dnd.selectedItems}
          rearrangeItems={rearrangeItems}
          setInsertIndex={setInsertIndex}
          onSelectionChange={handleItemSelection}
          clearItemSelection={clearItemSelection}
          {...{ ...propsForItem, ...{ style, remove: () => removeItem(item.id) } }}
        />
      </Fragment>
    );
  }

  return <List {...propsForList}>{state.items.map((item, index) => renderItem(item, index))}</List>;
}

GridDND.defaultProps = {
  propsForList: undefined,
  propsForItem: undefined,
  propsForDraggedItem: undefined,
  flexBasis: '25%',
};
