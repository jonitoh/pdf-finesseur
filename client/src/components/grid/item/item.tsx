import React, { ReactNode, CSSProperties, ComponentType } from 'react';
import classNames from 'classnames';
import styles from './item.module.css';

export type Props = {
  style?: CSSProperties;
  children?: ReactNode;
};

export default function GridItem({ style, children }: Props) {
  if (children) {
    return (
      <div className={styles.wrapper} style={style}>
        <div className={styles.item}>{children}</div>
      </div>
    );
  }
  return null;
}

export function withGridItemOptions<T extends Object>(
  Component: ComponentType<T>,
  wrapperClassName?: string,
  gridItemClassName?: string
) {
  function Wrapper(props: T) {
    console.log('--withGridItemOptions--', props);
    if (<Component {...props} /> === null) {
      return null;
    }
    // style={props.style}
    return (
      <div className={classNames([styles.wrapper, wrapperClassName])}>
        <div className={classNames([styles.item, gridItemClassName])}>
          <Component {...props} />
        </div>
      </div>
    );
  }

  Wrapper.defaultProps = Component.defaultProps;

  return Wrapper;
}

GridItem.defaultProps = {
  style: undefined,
  children: undefined,
};
