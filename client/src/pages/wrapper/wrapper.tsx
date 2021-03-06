import React, { CSSProperties, ReactNode, Fragment } from 'react';
import Icon from '#common/icon';
import NavigationButton from '#components/common/buttons/navigation-button';
import styles from './wrapper.module.css';

const genericLeftButton = (
  <NavigationButton link="/" icon={<Icon.NavBackArrow />} type="button" variant="apparent" />
);

const genericRightButton = null;

export type Props = {
  LeftButton?: ReactNode;
  RightButton?: ReactNode;
  hasNavigation?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
};

export default function Wrapper({
  LeftButton,
  RightButton,
  hasNavigation,
  style,
  children,
}: Props) {
  if (LeftButton || RightButton || hasNavigation) {
    return (
      <div className={styles.page}>
        <div className={styles.navbar}>
          {LeftButton}
          {RightButton}
        </div>
        <div className={styles.main} style={style}>
          {children}
        </div>
      </div>
    );
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment>{children}</Fragment>;
}

Wrapper.defaultProps = {
  LeftButton: genericLeftButton,
  RightButton: genericRightButton,
  hasNavigation: false,
  style: undefined,
  children: undefined,
};
