import React from "react";
import PropTypes from 'prop-types';
import { withDragAndDropOptions } from "./core/withDragAndDropOptions";
import { withItemsDragPreview } from './core/withItemsDragPreview';
import { withItemDragLayer } from './core/withItemDragLayer';
import Card from "./Card";

const Item = withDragAndDropOptions(Card);

Item.propTypes = {
  selectedItems: PropTypes.array.isRequired,
  clearItemSelection: PropTypes.func.isRequired,
  rearrangeItems: PropTypes.func.isRequired,
  setInsertIndex: PropTypes.func.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  insertLineOnLeft: PropTypes.bool.isRequired,
  insertLineOnRight: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired
};

const ItemsDragPreview = withItemsDragPreview(Card);

ItemsDragPreview.propTypes = {
  items: PropTypes.array
};

const ItemDragLayer = withItemDragLayer(ItemsDragPreview);

export {
  Item,
  ItemDragLayer,
  ItemsDragPreview,
};

