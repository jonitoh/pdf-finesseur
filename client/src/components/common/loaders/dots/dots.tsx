import React from 'react';
import styles from './dots.module.css';

export type Props = {
  size?: number;
};

export default function Loader({ size }: Props) {
  return (
    <div className={styles.spinner}>
      <span />
      <span />
      <span />
    </div>
  );
}

Loader.defaultProps = {
  size: 3,
};

/*
.spinner span:nth-child(1) {
  animation: fade 1s ease-in-out infinite;
}
*/
