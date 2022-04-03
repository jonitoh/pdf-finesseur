import React, { ComponentType, CSSProperties } from 'react';
import { useDragLayer, XYCoord } from 'react-dnd';
import { DNDItem } from '#/services/item-and-element';
import { DNDItemTypes } from '#/utils/dnd';
import { DragObject } from './with-drag-and-drop-options';

// helpers function
const defaultLayerStyles: CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

function getItemStyles(currentOffset: XYCoord | null): CSSProperties {
  if (!currentOffset) {
    return {
      display: 'none',
    };
  }
  const { x, y } = currentOffset;
  return {
    transform: `translate(${x}px, ${y}px)`,
    filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.45))',
  };
}

// helpers dor DND interaction
// Identifier should be exported from react-dnd
type Identifier = string | symbol;

type CollectedProps = {
  itemType: Identifier | null;
  isDragging: boolean;
  dndItem: DragObject;
  currentOffset: XYCoord | null;
};

export type MutatedProps<T> = Omit<T, 'items'>;

export default function withItemDragLayer<T extends { items: DNDItem[] }>(
  Component: ComponentType<T>,
  layerStyles: CSSProperties = defaultLayerStyles
) {
  function Wrapper(props: MutatedProps<T>) {
    const { itemType, isDragging, dndItem, currentOffset } = useDragLayer<
      CollectedProps,
      DragObject
    >((monitor) => ({
      dndItem: monitor.getItem(),
      itemType: monitor.getItemType(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

    function renderItem(
      dndItemType: Identifier | null,
      dragObject: DragObject,
      rest: MutatedProps<T>
    ) {
      switch (dndItemType) {
        case DNDItemTypes.PAGE:
          return <Component {...({ ...rest, items: dragObject.itemsDragStack } as T)} />;
        default:
          return null;
      }
    }

    if (!isDragging) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(currentOffset)}>{renderItem(itemType, dndItem, props)}</div>
      </div>
    );
  }
  return Wrapper;
}
