import React, { CSSProperties, ReactElement } from 'react';
import List, { Props as ListProps } from '#components/grid/list/list';
import Item, { Props as ItemProps } from '#components/grid/item/item';
import { calculateFlexBasis } from '#/utils/main';
import styles from './core.module.css';

export type MinimalFunctionalities = {
  remove(): void;
};

type MinimalItem = Object & { id: string };

export type Props<T = MinimalItem> = {
  items: (T extends MinimalItem ? T : never)[];
  renderItem(item: T extends MinimalItem ? T : never): ReactElement;
  propsForList?: Omit<ListProps, 'children'>;
  propsForItem?: Omit<ItemProps, 'children'>;
  flexBasis?: CSSProperties['flexBasis'];
};

export default function GridCore<T>({
  items,
  renderItem,
  propsForList,
  propsForItem,
  flexBasis,
}: Props<T>) {
  // in order to customize the number of rows
  const style = flexBasis ? { flexBasis: calculateFlexBasis(flexBasis) } : {};

  return (
    <List {...propsForList}>
      {items.map((item) => (
        <Item key={item.id} {...{ ...propsForItem, ...{ style } }}>
          {renderItem(item)}
        </Item>
      ))}
    </List>
  );
}

GridCore.defaultProps = {
  propsForList: undefined,
  propsForItem: undefined,
  flexBasis: '25%',
};
