import React, { MouseEventHandler, ElementType } from 'react';
import Button from '#common/buttons/button';
import styles from './thumbnail.module.css';

export type Props = {
  src: string;
  label: string;
  LeftIcon: ElementType;
  RightIcon: ElementType;
  leftOnClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  rightOnClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
};

export default function ThumbnailCard({
  src,
  label,
  LeftIcon,
  RightIcon,
  leftOnClick,
  rightOnClick,
}: Props) {
  return (
    <div className={styles.card}>
      <img src={src} alt={label} />
      <div className={styles.infoContent}>
        <div className={styles.topSection}>
          <div className={styles.leftArea}>
            <Button type="button" onClick={leftOnClick} icon={<LeftIcon />} />
          </div>
          <div className={styles.rightArea}>
            <Button type="button" onClick={rightOnClick} icon={<RightIcon />} />
          </div>
        </div>
        <div className={styles.bottomSection}>
          <h3>{label}</h3>
        </div>
      </div>
    </div>
  );
}

ThumbnailCard.defaultProps = {
  leftOnClick: undefined,
  rightOnClick: undefined,
};
