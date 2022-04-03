import React, { useCallback, KeyboardEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import ApparentButton, { Props as ApparentButtonProps } from './apparent-button';

export interface Props extends ApparentButtonProps {
  link?: string;
}

export default function NavigationApparentButton({ link, onClick, onKeyPress, ...rest }: Props) {
  if (!link) {
    return <ApparentButton {...{ onClick, onKeyPress, ...rest }} />;
  }

  const navigate = useNavigate();
  const globalOnClick = useCallback(function f(event: MouseEvent<HTMLDivElement>) {
    if (onClick) {
      onClick(event);
    }
    navigate(link);
  }, []);
  const globalOnKeyPress = useCallback(function f(event: KeyboardEvent<HTMLDivElement>) {
    if (onKeyPress) {
      onKeyPress(event);
    }
    navigate(link);
  }, []);
  return <ApparentButton {...{ onClick: globalOnClick, onKeyPress: globalOnKeyPress, ...rest }} />;
}

NavigationApparentButton.defaultProps = {
  ...ApparentButton.defaultProps,
  link: undefined,
};
