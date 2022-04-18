// https://github.com/shubhamV123/star-rating/blob/main/src/Rating.jsx
import React, { HTMLAttributes, ElementType, useState, useRef, MouseEvent, useEffect } from 'react';
import Icon from '#common/icon';
import classNames from 'classnames';
import { generateWeakId } from '#utils/main';
import styles from './rating.module.css';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  initialValue?: number;
  size?: number;
  precision?: number;
  Pattern?: ElementType;
  backgroundColor?: string;
  ratingColor?: string;
  borderColor?: string;
  hasBorder?: boolean;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
}

// see how you can extract the value of the rating

export default function Rating({
  initialValue,
  size,
  precision,
  Pattern,
  backgroundColor,
  ratingColor,
  borderColor,
  hasBorder,
  disabled,
  onValueChange,
  ...rest
}: Props) {
  if (!initialValue || !size) return null;
  const { className, ...props } = rest;
  const [value, _setValue] = useState(initialValue > size ? size : initialValue);
  const [hoverValue, setHoverValue] = useState(-1);
  const [isHovered, setIsHovered] = useState(false);
  const ratingRef = useRef<HTMLDivElement>(null);

  // in-between variables
  const activeValue = isHovered ? hoverValue : value;
  const isActiveRating = activeValue !== 1;
  const isRatingWithPrecision = activeValue % 1 !== 0;

  function setValue(val: number) {
    if (onValueChange) {
      onValueChange(val);
    }
    _setValue(val);
  }

  useEffect(() => setValue(initialValue), []);

  function calculateRating(e: MouseEvent<HTMLDivElement>) {
    if (!ratingRef || !size || !precision) return 0;
    const { width, left } = (ratingRef.current as HTMLDivElement).getBoundingClientRect();
    const percent = (e.clientX - left) / width;
    const nearestNumber = Math.round((percent * size + precision / 2) / precision) * precision;
    return Number(nearestNumber.toFixed(precision.toString().split('.')[1]?.length || 0));
  }

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    setIsHovered(false);
    setValue(calculateRating(e));
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    setIsHovered(true);
    setHoverValue(calculateRating(e));
  }

  function handleMouseLeave(e: MouseEvent<HTMLDivElement>) {
    setIsHovered(false);
    setHoverValue(-1); // reset to default state
  }

  function renderPattern(index: number) {
    if (!Pattern || !size || !borderColor || !backgroundColor) return;

    const uniqueId = generateWeakId();
    const shouldColor = Math.ceil(activeValue) >= index + 1;
    const isRatingEqualToIndex = Math.ceil(activeValue) === index + 1;
    const showRatingWithPrecision = isActiveRating && isRatingWithPrecision && isRatingEqualToIndex;
    const gap = showRatingWithPrecision ? (1 - (activeValue % 1)) * 100 : 0;

    return (
      <div
        className={styles.container}
        key={`rating-${uniqueId}-${index}`}
        role="menuitem"
        tabIndex={index === 0 ? 0 : -1}
        style={{ width: `${Math.round(100 / size)}%` }}
      >
        <Pattern
          className={classNames([styles.icon, styles.background])}
          fill={shouldColor ? ratingColor : backgroundColor}
          stroke={hasBorder ? borderColor : 'none'}
          strokeWidth={hasBorder ? 15 : 0}
          clipPath={`inset(0% ${gap}% 0% 0%)`}
        />
        <Pattern
          className={styles.icon}
          fill={backgroundColor}
          stroke={hasBorder ? borderColor : 'none'}
          strokeWidth={hasBorder ? 15 : 0}
        />
      </div>
    );
  }

  return (
    <div
      className={classNames([styles.wrapper, disabled ? styles.disabled : false, className])}
      {...props}
      onClick={handleClick}
      onKeyPress={() => null}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={ratingRef}
      role="menu"
      tabIndex={0}
    >
      {[...new Array(size)].map((arr, idx) => renderPattern(idx))}
    </div>
  );
}

Rating.defaultProps = {
  initialValue: -1,
  size: 5,
  precision: 1,
  Pattern: Icon.Star,
  backgroundColor: 'grey',
  ratingColor: 'yellow',
  borderColor: 'yellow',
  hasBorder: false,
  disabled: false,
  onValueChange: undefined,
};
