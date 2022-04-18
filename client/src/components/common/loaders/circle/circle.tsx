import React from 'react';
import styles from './circle.module.css';

export default function Loader() {
  return (
    <div className={styles.spinner}>
      <svg className={styles.circular} viewBox="25 25 50 50">
        <circle
          className="path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="3"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  );
}
