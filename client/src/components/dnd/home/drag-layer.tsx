import React from 'react';
import withItemDragLayer, { MutatedProps } from '#components/dnd/core/with-item-drag-layer';
import ItemsDragPreview, {
  Props as ItemsDragPreviewProps,
} from '#components/dnd/home/drag-preview';

export type Props = MutatedProps<ItemsDragPreviewProps>;

export default withItemDragLayer(ItemsDragPreview);
