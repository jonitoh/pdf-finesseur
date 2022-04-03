import React, { CSSProperties } from 'react';
import withInnerNavigation from '#pages/wrapper/options';
import Placeholder from '#common/placeholder/placeholder';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GridDND from '#components/grid/dnd/dnd';
import styles from './home.module.css';

export type Props = CSSProperties;

function HomePage(props: Props) {
  // propsForList
  const propsForList = {
    emptyChildren: <Placeholder>Go upload some files!!</Placeholder>,
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

export default withInnerNavigation(HomePage, { LeftButton: null });
