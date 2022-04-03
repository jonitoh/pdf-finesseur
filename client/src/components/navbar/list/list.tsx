import React, { ReactNode } from 'react';
import styles from './list.module.css';

export type Props = {
  children: ReactNode;
};

export default function NavbarList({ children }: Props) {
  return children ? <ul className={styles.ul}>{children}</ul> : null;
}
