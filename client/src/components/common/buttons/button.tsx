import React, { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './button.module.css';

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  type: 'submit' | 'reset' | 'button';
  icon?: ReactNode;
  iconPosition?: 'right' | 'left' | 'up' | 'bottom';
  label?: string | ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  variant?: 'transparent' | 'apparent' | 'basic' | 'plain' | 'expand' | 'minimize';
}

export default function Button({
  type,
  icon,
  iconPosition,
  label,
  onClick,
  variant,
  ...rest
}: Props) {
  const { className, ...props } = rest;
  return (
    <button
      className={classNames([
        className,
        styles.button,
        iconPosition ? styles[`main-item-position-${iconPosition}`] : false,
        variant ? styles[variant] : false,
      ])}
      onClick={onClick}
      type={type}
      {...props}
    >
      {!!icon && (
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
      )}
      {!!label && <span className={styles.label}>{label}</span>}
    </button>
  );
}

Button.defaultProps = {
  icon: null,
  iconPosition: 'left',
  label: undefined,
  onClick: undefined,
  variant: 'basic',
};
