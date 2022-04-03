import classNames from 'classnames';
import React, { ReactNode, HTMLAttributes } from 'react';
import styles from './list.module.css';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  backgroundImg?: string;
  emptyChildren?: ReactNode;
  children?: ReactNode;
}

export default function GridList({ backgroundImg, emptyChildren, children, ...rest }: Props) {
  const backgroundStyle = backgroundImg
    ? {
        backgroundImage: `url(${backgroundImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'auto 85%',
      }
    : {};

  const { style, className, ...props } = rest;

  if (children || emptyChildren) {
    return (
      <div
        {...props}
        className={classNames([className, styles.div])}
        style={{ ...style, ...backgroundStyle }}
      >
        {children || emptyChildren}
      </div>
    );
  }

  return null;
}

GridList.defaultProps = {
  backgroundImg: undefined,
  emptyChildren: null,
  children: null,
};
