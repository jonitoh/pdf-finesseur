import React, { MouseEventHandler, ReactNode } from 'react';
import Button from '#common/buttons/button';
import classNames from 'classnames';
import cardStyles from '../card.module.css';
import styles from './one-click.module.css';
import {
  Props as StyleProps,
  defaultProps as StyleDefaultProps,
  getContentStyle,
  getShadowStyle,
} from '../options';

export interface Props extends StyleProps {
  src: string;
  imgText: string;
  actionText?: string;
  icon?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
}

export default function OneClickCard({
  shadowStyle,
  contentStyle,
  src,
  imgText,
  actionText,
  icon,
  onClick,
}: Props) {
  return (
    <div className={cardStyles.wrapper}>
      <div className={classNames([cardStyles.card, ...[getShadowStyle(cardStyles, shadowStyle)]])}>
        <div className={cardStyles.imgBox}>
          <img src={src} alt={imgText} />
        </div>
        <div
          className={classNames([
            cardStyles.infoContent,
            ...[getContentStyle(cardStyles, contentStyle)],
            styles.infoContent,
            ...[getContentStyle(styles, contentStyle)],
          ])}
        >
          <div className={styles.text}>{imgText}</div>
          <div className={styles.actionArea}>
            <Button
              type="button"
              label={actionText}
              onClick={onClick}
              className={styles.actionBtn}
              icon={icon}
              variant="basic"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

OneClickCard.defaultProps = {
  ...StyleDefaultProps,
  // shadowStyle: undefined,
  contentStyle: undefined,
  actionText: undefined,
  onClick: undefined,
  icon: undefined,
};
