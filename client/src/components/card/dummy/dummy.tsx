import React from 'react';
import styles from './dummy.module.css';

function propertyElement(keyProp: string, key: string, value: unknown) {
  return (
    <li key={keyProp}>
      <b>{key}</b>: {value}
    </li>
  );
}

export interface Props extends Object {}

export default function DummyCard(props: Props) {
  return (
    <div className={styles.card}>
      <ul>{Object.entries(props).map(([key, value]) => propertyElement(key, key, value))}</ul>
    </div>
  );
}
