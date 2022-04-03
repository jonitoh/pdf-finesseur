import React, { MouseEventHandler, ReactNode } from 'react';
import Button from '#common/buttons/button';
import styles from './two-click.module.css';

export type Props = {
  src: string;
  imgText: string;
  leftButtonText: string;
  rightButtonText: string;
  leftOnClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  rightOnClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export default function TwoClickCard({
  src,
  imgText,
  leftButtonText,
  rightButtonText,
  leftOnClick,
  rightOnClick,
  leftIcon,
  rightIcon,
}: Props) {
  return (
    <div className={styles.card}>
      <img src={src} alt={imgText} />
      <div className={styles.infoContent}>
        <h3>{imgText}</h3>
        <div className={styles.buttonArea}>
          <Button
            type="button"
            label={leftButtonText}
            onClick={leftOnClick}
            className={styles.leftBtn}
            icon={leftIcon}
          />
          <Button
            type="button"
            label={rightButtonText}
            onClick={rightOnClick}
            className={styles.rightBtn}
            icon={rightIcon}
          />
        </div>
      </div>
    </div>
  );
}

TwoClickCard.defaultProps = {
  leftOnClick: undefined,
  rightOnClick: undefined,
  leftIcon: undefined,
  rightIcon: undefined,
};
