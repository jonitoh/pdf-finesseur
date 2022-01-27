// à jeter ?
import React from "react";
import { Item, ItemDragLayer } from "./dnd-elements";

import { useStore } from './store/index';

const Container = () => {

  const state = useStore();

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
  ////////////////
  return (
    <main>
      <ItemDragLayer />
      <div className="container">
        {state.items.map((item, i) => {
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
              url={item.url}
              selectedItems={state.dnd.selectedItems}
              rearrangeItems={rearrangeItems}
              setInsertIndex={setInsertIndex}
              onSelectionChange={handleItemSelection}
              clearItemSelection={clearItemSelection}
              isSelected={state.dnd.selectedItems.includes(item)}
              insertLineOnLeft={insertLineOnLeft}
              insertLineOnRight={insertLineOnRight}
            />
          );
        })}
      </div>
    </main>
  );
}

export default Container;