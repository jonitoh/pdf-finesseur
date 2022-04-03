import React, { useCallback, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button, { Props as ButtonProps } from './button';

export interface Props extends ButtonProps {
  link?: string;
}

export default function NavigationButton({ link, onClick, ...rest }: Props) {
  if (!link) {
    return <Button {...{ onClick, ...rest }} />;
  }

  const navigate = useNavigate();
  const globalOnClick = useCallback(function f(event: MouseEvent<HTMLButtonElement>) {
    if (onClick) {
      onClick(event);
    }
    navigate(link);
  }, []);
  return <Button {...{ onClick: globalOnClick, ...rest }} />;
}

NavigationButton.defaultProps = {
  ...Button.defaultProps,
  link: undefined,
};
