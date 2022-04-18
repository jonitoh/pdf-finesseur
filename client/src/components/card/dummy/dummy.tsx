import React from 'react';
import classNames from 'classnames';
import cardStyles from '../card.module.css';
import styles from './dummy.module.css';
import { getShadowStyle } from '../options';

function propertyElement(keyProp: string, key: string, value: unknown) {
  return (
    <li className={styles.li} key={keyProp}>
      <b>{key}</b>: {value}
    </li>
  );
}

export interface Props extends Object {}

export default function DummyCard(props: Props) {
  return (
    <div className={cardStyles.wrapper}>
      <div
        className={classNames([
          cardStyles.card,
          styles.cardStyles,
          ...[getShadowStyle(cardStyles)],
        ])}
      >
        <ul className={styles.ul}>
          {Object.entries(props).map(([key, value]) => propertyElement(key, key, value))}
        </ul>
      </div>
    </div>
  );
}
