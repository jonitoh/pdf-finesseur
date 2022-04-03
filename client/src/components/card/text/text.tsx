import React from 'react';
import styles from './text.module.css';

export type Props = {
  text: string;
};

export default function TextCard({ text }: Props) {
  return (
    <div className={styles.card}>
      <h3>{text}</h3>
    </div>
  );
}
