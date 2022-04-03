import React, { CSSProperties } from 'react';
import Placeholder from '#common/placeholder/placeholder';
import select, { Store as State } from '#store';
import { Page } from '#/services/page-and-document';
import OneClickCard from '#components/card/one-click/one-click';
import GridCore from '#/components/grid/core/core';
import withInnerNavigation from '#pages/wrapper/options';
import styles from './bin.module.css';

const firstSelector = (state: State) => ({
  deletedPages: state.deletedPages,
});

const secondSelector = (state: State) => ({
  addAvailablePageByIdFromDeletedPages: state.addAvailablePageByIdFromDeletedPages,
});

export type Props = CSSProperties;

function BinPage(props: Props) {
  const { deletedPages } = select(firstSelector);
  const { addAvailablePageByIdFromDeletedPages } = select(secondSelector);

  // propsForList
  const propsForList = {
    emptyChildren: <Placeholder>Nothing here!</Placeholder>,
    style: { flexGrow: 1 },
  };

  // propsForItem
  const propsForItem = undefined;

  // removeFromGrid aka restaurer aka remove deleted page and add into available pages
  function removeFromGrid(itemId: string) {
    console.info(`WE are TRYING TO RESTORE A CARD WITH THE ID ${itemId}`);
    addAvailablePageByIdFromDeletedPages(itemId);
  }

  function renderItem(item: Page) {
    return (
      <OneClickCard
        src={item.url}
        imgText={item.name}
        onClick={() => removeFromGrid(item.id)}
        actionText="restore"
      />
    );
  }

  const { flexBasis } = props;

  return (
    <GridCore<Page>
      items={deletedPages}
      propsForList={propsForList}
      propsForItem={propsForItem}
      renderItem={renderItem}
      flexBasis={flexBasis}
    />
  );
}

BinPage.defaultProps = {
  flexBasis: '25%',
};

export default withInnerNavigation(BinPage);
