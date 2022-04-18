import React, { useRef } from 'react';
import Modal, { Ref as ModalRef } from '#common/alert/alert';
import withDragAndDropOptions, {
  OnlyDragAndDropOptionsProps,
  DragObject,
} from '#components/dnd/core/with-drag-and-drop-options';
import select, { Store as State } from '#store';
import coreStyles from '#components/dnd/core/styles.module.css';
import Icon from '#common/icon';
import { MinimalFunctionalities } from '#components/grid/core/core';
import { withGridItemOptions } from '#components/grid/item/item';
import CloseableThumbnail from '#components/card/closeable-thumbnail/closeable-thumbnail';
import { DNDItem } from '#services/item-and-element';

export { DragObject };

const selector = (state: State) => ({ getElementFromItem: state.getElementFromItem });

interface CardWithModalProps extends MinimalFunctionalities {
  item: DNDItem;
}

function CardWithModal(props: CardWithModalProps) {
  const { item, remove } = props;
  console.info(props);
  const modalRef = useRef<ModalRef>(null);
  const { getElementFromItem } = select(selector);
  const element = getElementFromItem(item.id);

  if (!element) {
    return null;
  }

  return (
    <>
      <Modal ref={modalRef}>{`modal msg for item ${element.name}`}</Modal>
      <CloseableThumbnail
        src={element.url}
        imgText={element.name}
        onClose={remove}
        onClick={() => modalRef?.current?.open()}
        ActionIcon={Icon.Info}
      />
    </>
  );
}

export type Props = OnlyDragAndDropOptionsProps & CardWithModalProps;

export default withGridItemOptions(
  withDragAndDropOptions(CardWithModal),
  undefined,
  coreStyles.item
);
