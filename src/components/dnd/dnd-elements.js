import React, { useRef } from 'react';
import ThumbnailCard from '@components/card/thumbnail-card/thumbnail-card';
import CloseableThumbnailCard from '@components/card/closeable-thumbnail-card/closeable-thumbnail-card';
import BasicCard from '@components/card/basic-card/basic-card';
import Modal from '@common/modal/modal';
import { withDragAndDropOptions } from "@components/dnd/core/withDragAndDropOptions";
import { withItemsDragPreview } from '@components/dnd/core/withItemsDragPreview';
import { withItemDragLayer } from '@components/dnd/core/withItemDragLayer';
import { useStore } from "@store";
import PropTypes from 'prop-types';
import "@components/dnd/core/styles.scoped.css";
import Icon from "@common/icon";

/*

      <ThumbnailCard
        imgSrc={element.url}
        label={element.name}
        onClickRight={() => removeItemSelection(element.id)}
        RightIcon={Icon.Close}
        onClickLeft={() => modal.current.open()}
        LeftIcon={Icon.DotsVertical}
      />

*/
const HomeCardWithModal = ({ item, ...gridProps }) => {
  const modal = useRef(null);
  const { removeItemSelection } = gridProps

  // mapping orderedItem and item
  const { getElementFromItem } = useStore(); // placement à optimiser
  const element = getElementFromItem(item.id);
  return (
    <React.Fragment>
      <Modal
        defaultOpened={false}
        allowHandleEscape={false}
        title={""}
        fade={false}
        ref={modal}
      >
        {`modal msg for item ${element.name}`}
      </Modal>
      <CloseableThumbnailCard
        imgSrc={element.url}
        label={element.name}
        onClose={() => removeItemSelection(element.id)}
        onClick={() => modal.current.open()}
        buttonLabel={Icon.Information}
      />
    </React.Fragment>
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
      <div className="grid-item item">
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
    <BasicCard
      label={element.name}
      imgSrc={element.url}
    />
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

