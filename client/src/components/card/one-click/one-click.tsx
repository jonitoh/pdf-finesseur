import React, { MouseEventHandler, ReactNode } from 'react';
import Button from '#common/buttons/button';
import styles from './one-click.module.css';

export type Props = {
  src: string;
  imgText: string;
  actionText?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  icon?: ReactNode;
};

export default function OneClickCard({ src, imgText, actionText, onClick, icon }: Props) {
  return (
    <div className={styles.card}>
      <img src={src} alt={imgText} />
      <div className={styles.infoContent}>
        <h3>{imgText}</h3>
        <Button
          type="button"
          label={actionText}
          onClick={onClick}
          className={styles.actionBtn}
          icon={icon}
        />
      </div>
    </div>
  );
}

OneClickCard.defaultProps = {
  actionText: undefined,
  onClick: undefined,
  icon: undefined,
};
