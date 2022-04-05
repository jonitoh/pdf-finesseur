import React, { ReactNode } from 'react';
import styles from './placeholder.module.css';

export type Props = {
  children: ReactNode;
};

export default function Placeholder({ children }: Props) {
  return <div className={styles.placeholder}>{children}</div>;
}
