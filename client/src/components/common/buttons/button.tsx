import React, { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './button.module.css';

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  type: 'submit' | 'reset' | 'button';
  icon?: ReactNode;
  iconPosition?: 'right' | 'left' | 'up' | 'bottom';
  hasAnimation?: boolean;
  label?: string | ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  variant?: 'plain' | 'transparent' | 'basic';
}

export default function Button({
  type,
  icon,
  iconPosition,
  hasAnimation,
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
        hasAnimation && styles.animation,
        iconPosition ? styles[`icon-position-${iconPosition}`] : false,
        variant ? styles[variant] : false,
      ])}
      onClick={onClick}
      type={type}
      {...props}
    >
      {!!icon && <span>{icon}</span>}
      {typeof label === 'string' ? <span>{label}</span> : { label }}
    </button>
  );
}

Button.defaultProps = {
  icon: null,
  iconPosition: 'left',
  hasAnimation: false,
  label: undefined,
  onClick: undefined,
  variant: 'basic',
};
