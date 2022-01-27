import React, { Fragment, useRef } from 'react';
import { TwoClickCard, SimpleCard } from '../../card/dummy-card/dummy-card';
import Modal from '../../modal/modal';
import { withDragAndDropOptions } from "../core/withDragAndDropOptions";
import { withItemsDragPreview } from '../core/withItemsDragPreview';
import { withItemDragLayer } from '../core/withItemDragLayer';
import { useStore } from "../../../store";
import PropTypes from 'prop-types';


const HomeCardWithModal = ({ item, ...gridProps }) => {
  const modal = useRef(null);
  const { removeItemSelection } = gridProps
  
  // mapping orderedItem and item
  const { getElementFromItem } = useStore(); // placement à optimiser
  const element = getElementFromItem(item.id);
  return (
    <Fragment>
      <Modal
        defaultOpened={false}
        allowHandleEscape={false}
        title={""}
        fade={false}
        ref={modal}
      >
        {`modal msg for item ${element.name}`}
      </Modal>
      <TwoClickCard {...{
        text: element.name,
        firstOnClick: () => removeItemSelection(element.id),
        firstLabel: "remove",
        secondOnClick: () => modal.current.open(),
        secondLabel: 'modal',
      }} />
      );
    </Fragment>
  )
}

const DNDItem = withDragAndDropOptions(HomeCardWithModal);

DNDItem.propTypes = {
  item: PropTypes.object.isRequired,
  selectedItems: PropTypes.array.isRequired,
  clearItemSelection: PropTypes.func.isRequired,
  rearrangeItems: PropTypes.func.isRequired,
  setInsertIndex: PropTypes.func.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  insertLineOnLeft: PropTypes.bool.isRequired,
  insertLineOnRight: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired
};

// à placer dans grid wrapper
const withGridFlexboxOptions = (WrappedComponent) => {
  const Wrapper = ({ style, ...props }) => (
    <div className="grid-item-wrapper" style={style}>
      <div className="grid-item card">
        <WrappedComponent {...props} />
      </div>
    </div>
  )
  return Wrapper;
}

const Item = withGridFlexboxOptions(DNDItem);

const PreviewCard = ({ item, ...gridProps }) => {
  // mapping orderedItem and item
  const { getElementFromItem } = useStore();
  const element = getElementFromItem(item.id);
  return (
    <SimpleCard {...{
      text: element.name,
    }} />
  )
}

const ItemsDragPreview = withItemsDragPreview(PreviewCard);

ItemsDragPreview.propTypes = {
  items: PropTypes.array
};

const ItemDragLayer = withItemDragLayer(ItemsDragPreview);

export {
  Item,
  ItemDragLayer,
  ItemsDragPreview,
};

