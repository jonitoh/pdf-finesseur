import React, { CSSProperties } from 'react';
import withInnerNavigation from '#pages/wrapper/options';
import Placeholder from '#common/placeholder/placeholder';
import select, { Store as State } from '#store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GridDND from '#components/grid/dnd/dnd';
import styles from './home.module.css';

const translatorSelector = (state: State) => ({
  softTranslator: state.softTranslator,
});

export type Props = CSSProperties;

function HomePage(props: Props) {
  const { softTranslator } = select(translatorSelector);

  // propsForList
  const propsForList = {
    emptyChildren: <Placeholder>{softTranslator('upload-item')}</Placeholder>,
  };

  // propsForItem
  const propsForItem = undefined;

  // propsForDraggedItem
  const propsForDraggedItem = undefined;

  const { flexBasis } = props;

  return (
    <DndProvider backend={HTML5Backend}>
      <GridDND
        propsForList={propsForList}
        propsForItem={propsForItem}
        propsForDraggedItem={propsForDraggedItem}
        flexBasis={flexBasis}
      />
    </DndProvider>
  );
}

HomePage.defaultProps = {
  flexBasis: '25%',
};

export default withInnerNavigation(HomePage, {
  LeftButton: null,
  RightButton: null,
  hasNavigation: true,
});
