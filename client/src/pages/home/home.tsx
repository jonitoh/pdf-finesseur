import React, { CSSProperties } from 'react';
import withInnerNavigation from '#pages/wrapper/options';
import Placeholder from '#common/placeholder/placeholder';
import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GridDND from '#components/grid/dnd/dnd';
import styles from './home.module.css';

export type Props = CSSProperties;

function HomePage(props: Props) {
  const { t } = useTranslation();

  // propsForList
  const propsForList = {
    emptyChildren: <Placeholder>{t('home.emptyItem', { ns: 'page' })}</Placeholder>,
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
