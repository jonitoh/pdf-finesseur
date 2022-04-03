import React, { ComponentType } from 'react';
import { DNDItem } from '#services/item-and-element';
import classNames from 'classnames';
import styles from './styles.module.css';

export type InjectedProps = {
  items: DNDItem[];
};

export default function withItemsDragPreview<T extends Object>(Component: ComponentType<T>) {
  function Wrapper({ items, ...rest }: InjectedProps & Omit<T, 'items'>) {
    return (
      <div>
        {items.slice(0, 3).map((item, i) => (
          <div
            key={item.id}
            className={classNames([styles.item, styles.itemDragged])}
            style={{
              zIndex: items.length - i,
              transform: `rotateZ(${-i * 2.5}deg)`,
            }}
          >
            <Component {...(rest as unknown as T)} item={item} />
          </div>
        ))}
      </div>
    );
  } //

  Wrapper.defaultProps = {
    // ...Component.defaultProps,
  };

  return Wrapper;
}
