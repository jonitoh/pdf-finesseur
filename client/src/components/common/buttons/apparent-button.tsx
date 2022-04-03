import React, { HTMLAttributes, MouseEventHandler, ReactNode, KeyboardEventHandler } from 'react';
import classNames from 'classnames';
import styles from './button.module.css';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  iconPosition?: 'right' | 'left' | 'up' | 'bottom';
  hasAnimation?: boolean;
  label?: string | ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement> | (() => void);
  onKeyPress?: KeyboardEventHandler<HTMLDivElement> | (() => void);
  variant?: 'plain' | 'transparent' | 'basic';
}

export default function ApparentButton({
  icon,
  iconPosition,
  hasAnimation,
  label,
  onClick,
  onKeyPress,
  variant,
  ...rest
}: Props) {
  const { className, ...props } = rest;
  return (
    <div
      className={classNames([
        className,
        styles.button,
        hasAnimation && styles.animation,
        iconPosition ? styles[`icon-position-${iconPosition}`] : false,
        variant ? styles[variant] : false,
      ])}
      onClick={onClick}
      onKeyPress={onKeyPress}
      tabIndex={0}
      role="button"
      {...props}
    >
      {!!icon && <div>{icon}</div>}
      {typeof label === 'string' ? <div>{label}</div> : { label }}
    </div>
  );
}

ApparentButton.defaultProps = {
  icon: null,
  iconPosition: 'left',
  hasAnimation: false,
  label: undefined,
  onClick: undefined,
  onKeyPress: undefined,
  variant: 'basic',
};
