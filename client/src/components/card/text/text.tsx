import React from 'react';
import classNames from 'classnames';
import cardStyles from '../card.module.css';
import styles from './text.module.css';
import { getShadowStyle } from '../options';

export type Props = {
  text: string;
};

export default function TextCard({ text }: Props) {
  return (
    <div className={cardStyles.wrapper}>
      <div className={classNames([cardStyles.card, styles.card, ...[getShadowStyle(cardStyles)]])}>
        <div className={styles.text}>{text}</div>
      </div>
    </div>
  );
}
