import React, { MouseEventHandler, ElementType } from 'react';
import Button from '#common/buttons/button';
import classNames from 'classnames';
import cardStyles from '../card.module.css';
import styles from './thumbnail.module.css';
import {
  Props as StyleProps,
  defaultProps as StyleDefaultProps,
  getContentStyle,
  getShadowStyle,
} from '../options';

export interface Props extends StyleProps {
  src: string;
  label: string;
  LeftIcon: ElementType;
  RightIcon: ElementType;
  leftOnClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  rightOnClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
}

export default function ThumbnailCard({
  shadowStyle,
  contentStyle,
  src,
  label,
  LeftIcon,
  RightIcon,
  leftOnClick,
  rightOnClick,
}: Props) {
  return (
    <div className={classNames([cardStyles.wrapper, styles.wrapper])}>
      <div
        className={classNames([
          cardStyles.card,
          styles.card,
          ...[getShadowStyle(cardStyles, shadowStyle)],
        ])}
      >
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
          <div className={styles.topSection}>
            <div className={styles.leftArea}>
              <Button type="button" onClick={leftOnClick} icon={<LeftIcon />} />
            </div>
            <div className={styles.rightArea}>
              <Button type="button" onClick={rightOnClick} icon={<RightIcon />} />
            </div>
          </div>
          <div className={styles.bottomSection}>
            <div className={styles.text}>{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

ThumbnailCard.defaultProps = {
  ...StyleDefaultProps,
  // shadowStyle: undefined,
  // contentStyle: 'appear',
  leftOnClick: undefined,
  rightOnClick: undefined,
};
