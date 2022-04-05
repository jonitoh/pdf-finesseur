import React, { ElementType, MouseEventHandler } from 'react';
import { Props as ButtonProps } from '#common/buttons/button';
import NavigationButton from '#common/buttons/navigation-button';
import styles from './item.module.css';

export interface Props extends Omit<ButtonProps, 'type'> {
  link: string;
  Icon: ElementType;
  count?: number;
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
}

export default function NavbarItem({ link, Icon, count, text, onClick, ...rest }: Props) {
  return (
    <li className={styles.li}>
      <NavigationButton
        link={link}
        icon={<Icon notificationCount={count} />}
        iconPosition="up"
        label={<p className={styles.label}>{text}</p>}
        onClick={onClick}
        type="button"
        // variant="transparent"
        {...rest}
      />
    </li>
  );
}

NavbarItem.defaultProps = {
  count: 0,
  onClick: undefined,
};
