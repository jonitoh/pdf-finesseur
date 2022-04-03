import React, { MouseEventHandler, ElementType } from 'react';
import Button from '#common/buttons/button';
import Icon from '#common/icon';
import styles from './closeable-thumbnail.module.css';

export type Props = {
  src: string;
  imgText: string;
  actionText?: string;
  closeText?: string;
  ActionIcon?: ElementType;
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  onClose?: MouseEventHandler<HTMLButtonElement> | (() => void);
};

export default function CloseableThumbnailCard({
  src,
  imgText,
  actionText,
  closeText,
  ActionIcon,
  onClick,
  onClose,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <img src={src} alt={imgText} />
        <div className={styles.infoContent}>
          <Button
            type="button"
            label={actionText}
            onClick={onClick}
            className={styles.actionBtn}
            icon={ActionIcon ? <ActionIcon /> : undefined}
          />
        </div>
      </div>
      <Button
        type="button"
        icon={<Icon.Close />}
        label={closeText}
        onClick={onClose}
        className={styles.closeBtn}
      />
    </div>
  );
}

CloseableThumbnailCard.defaultProps = {
  actionText: undefined,
  closeText: undefined,
  onClick: undefined,
  onClose: undefined,
  ActionIcon: undefined,
};
