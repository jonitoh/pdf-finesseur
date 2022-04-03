import React from 'react';
import { DNDItem } from '#services/item-and-element';
import BasicCard from '#components/card/basic/basic';
import withItemsDragPreview, { InjectedProps } from '#components/dnd/core/with-items-drag-preview';
import select, { Store as State } from '#store';

const selector = (state: State) => ({ getElementFromItem: state.getElementFromItem });

type PreviewCardProps = {
  item: DNDItem;
};

function PreviewCard(props: PreviewCardProps) {
  const { item } = props;
  const { getElementFromItem } = select(selector);
  const element = getElementFromItem(item.id);

  if (!element) {
    return null;
  }

  return <BasicCard label={element.name} src={element.url} />;
}

export type Props = InjectedProps & PreviewCardProps;

export default withItemsDragPreview(PreviewCard);
