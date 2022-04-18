import React from 'react';
import styles from './dots.module.css';

export default function Loader() {
  return (
    <div className={styles.spinner}>
      <span />
      <span />
      <span />
    </div>
  );
}
