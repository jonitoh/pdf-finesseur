import React, { MouseEventHandler, ElementType } from 'react';
import Button from '#common/buttons/button';
import Icon from '#common/icon';
import classNames from 'classnames';
import cardStyles from '../card.module.css';
import styles from './closeable-thumbnail.module.css';
import {
  Props as StyleProps,
  defaultProps as StyleDefaultProps,
  getContentStyle,
  getShadowStyle,
} from '../options';

export interface Props extends StyleProps {
  closeButtonStyle?: ('appear' | 'corner' | 'circle')[];
  src: string;
  imgText: string;
  actionText?: string;
  subActionText?: string;
  closeText?: string;
  ActionIcon?: ElementType;
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  onClose?: MouseEventHandler<HTMLButtonElement> | (() => void);
}

function getCloseButtonStyle(style?: string[] | string): string[] {
  if (style instanceof Array) {
    return style.map((s) => getCloseButtonStyle(s)).reduce((prev, cur) => prev.concat(cur), []);
  }
  switch (style) {
    case 'appear':
      return [styles.asAppear];
    case 'corner':
      return [styles.asCorner];
    case 'circle':
      return [styles.asCircle];
    default:
      return [styles.asAppear, styles.asCorner];
  }
}

export default function CloseableThumbnailCard({
  shadowStyle,
  closeButtonStyle,
  contentStyle,
  src,
  imgText,
  actionText,
  subActionText,
  closeText,
  ActionIcon,
  onClick,
  onClose,
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
          {subActionText && <div className={styles.text}>{subActionText}</div>}
          <div className={styles.actionArea}>
            <Button
              type="button"
              label={actionText}
              onClick={onClick}
              className={styles.actionBtn}
              icon={ActionIcon ? <ActionIcon /> : undefined}
              variant="basic"
            />
          </div>
        </div>
      </div>
      <div
        className={classNames([
          cardStyles.outerContent,
          ...[getContentStyle(cardStyles, contentStyle)],
          styles.closeArea,
          ...[getCloseButtonStyle(closeButtonStyle)],
        ])}
      >
        <Button
          type="button"
          icon={<Icon.Close />}
          label={closeText}
          onClick={onClose}
          className={styles.closeBtn}
          variant="apparent" // "basic"
        />
      </div>
    </div>
  );
}

CloseableThumbnailCard.defaultProps = {
  ...StyleDefaultProps,
  // shadowStyle: undefined,
  closeButtonStyle: undefined,
  // contentStyle: 'appear',
  actionText: undefined,
  subActionText: undefined,
  closeText: undefined,
  onClick: undefined,
  onClose: undefined,
  ActionIcon: undefined,
};
