import React, { useRef, useEffect, ComponentType, MouseEvent, KeyboardEvent } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';
import { DNDItemTypes } from '#utils/dnd';
import { DNDItem } from '#services/item-and-element';
import classNames from 'classnames';
import styles from './styles.module.css';

// type for DND implementation
export type DragObject = {
  items: DNDItem[];
  itemsDragStack: DNDItem[];
  draggedItem: DNDItem;
  itemsIDs: string[];
};

type DraggedCollectedProps = {
  isDragging: boolean;
};

type DroppedCollectedProps = {
  isHovered: boolean;
};

export type OnlyDragAndDropOptionsProps = {
  index: number;
  isSelected: boolean;
  shouldInsertLineOnLeft: boolean;
  shouldInsertLineOnRight: boolean;
  item: DNDItem;
  selectedItems: DNDItem[];
  rearrangeItems(dragObject: DragObject): void;
  setInsertIndex(dragIndex: number, hoverIndex: number, newInsertIndex: number): void;
  onSelectionChange(index: number, hasCmdKey: boolean, hasShiftKey: boolean): void;
  clearItemSelection(): void;
};

const defaultOnlyDragAndDropOptionsProps = {};

export default function withDragAndDropOptions<T extends { item: DNDItem }>(
  Component: ComponentType<T>
) {
  function Wrapper(props: OnlyDragAndDropOptionsProps & T) {
    console.log('--withDragAndDropOptions--', props);
    const {
      index,
      isSelected,
      shouldInsertLineOnLeft,
      shouldInsertLineOnRight,
      item: propItem,
      selectedItems,
      rearrangeItems,
      setInsertIndex,
      onSelectionChange,
      clearItemSelection,
      ...rest
    } = props;

    const { id, order } = propItem;

    const ref = useRef<HTMLDivElement>(null);

    // drag interaction
    const [{ isDragging }, drag, preview] = useDrag<DragObject, unknown, DraggedCollectedProps>({
      type: DNDItemTypes.PAGE,
      item() {
        const draggedItem: DNDItem = { id, order };
        let items: DNDItem[];
        if (selectedItems.find((item) => item.id === id)) {
          items = selectedItems;
        } else {
          clearItemSelection();
          items = [draggedItem];
        }
        const otherItems = items.concat();
        otherItems.splice(
          items.findIndex((item) => item.id === id),
          1
        );
        const itemsDragStack = [draggedItem, ...otherItems];
        const itemsIDs = items.map((item) => item.id);
        return { items, itemsDragStack, draggedItem, itemsIDs };
      },
      isDragging(monitor) {
        return monitor.getItem().itemsIDs.includes(id);
      },
      end(draggedItem) {
        rearrangeItems(draggedItem);
        clearItemSelection();
      },
      collect(monitor) {
        return { isDragging: monitor.isDragging() };
      },
    });

    // drop interaction
    const [{ isHovered }, drop] = useDrop<DragObject, unknown, DroppedCollectedProps>({
      accept: DNDItemTypes.PAGE,
      hover(item, monitor) {
        const dragIndex = item.draggedItem.order;
        const hoverIndex = index;

        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect();

        // Get horizontal middle
        const midX = hoverBoundingRect
          ? hoverBoundingRect.left + (hoverBoundingRect.right - hoverBoundingRect.left) / 2
          : undefined;

        // Determine mouse position
        const pointerOffset = monitor.getClientOffset();
        if (pointerOffset && midX) {
          const newInsertIndex = pointerOffset.x < midX ? hoverIndex : hoverIndex + 1;
          setInsertIndex(dragIndex, hoverIndex, newInsertIndex);
        }
      },
      collect(monitor) {
        return { isHovered: monitor.isOver() };
      },
    });

    // attach reference
    drag(drop(ref));

    function onClick(event: MouseEvent<HTMLDivElement>) {
      onSelectionChange(index, event.metaKey, event.shiftKey);
    }

    function onKeyPress(event: KeyboardEvent<HTMLDivElement>) {
      onSelectionChange(index, event.metaKey, event.shiftKey);
    }

    useEffect(() => {
      // This gets called after every render, by default
      // (the first one, and every one after that)

      // Use empty image as a drag preview so browsers don't draw it
      // and we can draw whatever we want on the custom drag layer instead.
      preview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true,
      });
      // If you want to implement componentWillUnmount,
      // return a function from here, and React will call
      // it prior to unmounting.
      // return () => console.log('unmounting...');
    }, []);

    const opacity: number = isDragging ? 0.4 : 1;

    const styleClasses: string[] = [];

    // if (isDragging) {
    //   styleClasses.push('cardWrapperDragging');
    // }

    if (isSelected) {
      styleClasses.push('itemWrapperSelected');
    }

    return (
      <div key={`item-div-${id}`} style={{ position: 'relative' }}>
        {shouldInsertLineOnLeft && isHovered && <div className={styles.insertLineLeft} />}
        <div className={classNames([styles.itemWrapper, styleClasses.map((cls) => styles[cls])])}>
          <div
            ref={ref}
            className={styles.item}
            onClick={onClick}
            onKeyPress={onKeyPress}
            style={{ opacity }}
            role="gridcell"
            tabIndex={-1}
          >
            <Component {...({ ...rest, item: propItem } as unknown as T)} />
          </div>
        </div>
        {shouldInsertLineOnRight && isHovered && <div className={styles.insertLineRight} />}
      </div>
    );
  }

  Wrapper.defaultProps = {
    // ...Component.defaultProps,
    ...defaultOnlyDragAndDropOptionsProps,
  };

  return Wrapper;
}
