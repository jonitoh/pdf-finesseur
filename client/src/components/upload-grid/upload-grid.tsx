import React, { CSSProperties } from 'react';
import Placeholder from '#common/placeholder/placeholder';
import select, { Store as State } from '#store';
import { Doc } from '#/services/page-and-document';
import TwoClickCard from '#components/card/two-click/two-click';
import GridCore from '#/components/grid/core/core';
import styles from './upload-grid.module.css';

const firstSelector = (state: State) => ({
  documents: state.documents,
  deletedPages: state.deletedPages,
});

const secondSelector = (state: State) => ({
  removePagesByDocumentFromDeletedPages: state.removePagesByDocumentFromDeletedPages,
  removeDocument: state.removeDocument,
  addAvailablePageByIdFromDeletedPages: state.addAvailablePageByIdFromDeletedPages,
});

export type Props = CSSProperties;

export default function UploadGrid(props: Props) {
  const { documents, deletedPages } = select(firstSelector);

  const {
    removePagesByDocumentFromDeletedPages,
    removeDocument,
    addAvailablePageByIdFromDeletedPages,
  } = select(secondSelector);

  // console.info('upload grid items', documents);

  // propsForList
  const propsForList = {
    emptyChildren: <Placeholder>Upload some file !</Placeholder>,
    style: { flexGrow: 1 },
  };

  // propsForItem
  const propsForItem = undefined;

  // removeFromGrid aka remove document forever
  function removeFromGrid(itemId: string) {
    console.info(`WE are TRYING TO REMOVE A DOCUMENT WITH THE ID ${itemId}`);
    removeDocument(itemId);
    removePagesByDocumentFromDeletedPages(itemId);
  }

  // restaurer à la chaine
  function restoreAll(itemId: string) {
    console.info(`restore all the pages from the document ${itemId}`);
    [...deletedPages]
      .filter((page) => page.docId === itemId)
      .forEach((page) => addAvailablePageByIdFromDeletedPages(page.id));
  }

  function renderItem(item: Doc) {
    return (
      <TwoClickCard
        src={item.url}
        imgText={item.name}
        leftButtonText="restore all"
        leftOnClick={() => restoreAll(item.id)}
        rightButtonText="close"
        rightOnClick={() => removeFromGrid(item.id)}
      />
    );
  }

  const { flexBasis } = props;

  return (
    <GridCore<Doc>
      items={documents}
      propsForList={propsForList}
      propsForItem={propsForItem}
      renderItem={renderItem}
      flexBasis={flexBasis}
    />
  );
}

UploadGrid.defaultProps = {
  flexBasis: '25%',
};
