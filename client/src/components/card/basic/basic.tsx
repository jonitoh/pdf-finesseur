import React from 'react';
import styles from './basic.module.css';

export type Props = {
  src: string;
  label: string;
};

export default function BasicCard({ src, label }: Props) {
  return (
    <div className={styles.card}>
      <img src={src} alt={label} />
      <div className={styles.infoContent}>
        <h3>{label}</h3>
      </div>
    </div>
  );
}
