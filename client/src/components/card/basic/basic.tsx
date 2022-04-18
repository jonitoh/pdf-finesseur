import React from 'react';
import classNames from 'classnames';
import cardStyles from '../card.module.css';
import styles from './basic.module.css';
import {
  Props as StyleProps,
  defaultProps as StyleDefaultProps,
  getContentStyle,
  getShadowStyle,
} from '../options';

export interface Props extends StyleProps {
  src: string;
  label: string;
}

export default function BasicCard({ shadowStyle, contentStyle, src, label }: Props) {
  return (
    <div className={cardStyles.wrapper}>
      <div className={classNames([cardStyles.card, ...[getShadowStyle(cardStyles, shadowStyle)]])}>
        <div className={cardStyles.imgBox}>
          <img src={src} alt={label} />
        </div>
        <div
          className={classNames([
            cardStyles.infoContent,
            ...[getContentStyle(cardStyles, contentStyle)],
            styles.infoContent,
            ...[getContentStyle(styles, contentStyle)],
          ])}
        >
          <div className={styles.text}>{label}</div>
        </div>
      </div>
    </div>
  );
}

BasicCard.defaultProps = {
  ...StyleDefaultProps,
};
