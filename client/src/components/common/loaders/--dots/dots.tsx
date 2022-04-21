import React from 'react';
import styles from './dots.module.css';

export type Props = {};

export default function Loader() {
  return (
    <div className={styles.spinner}>
      <span />
      <span />
      <span />
    </div>
  );
}

/*
.spinner span:nth-child(1) {
  animation: fade 1s ease-in-out infinite;
}
*/
