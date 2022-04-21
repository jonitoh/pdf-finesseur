import React, { HTMLAttributes } from 'react';
import { generateWeakId } from '#utils/main';
import classNames from 'classnames';
import styles from './dots.module.css';

const sizeMax: number = 20;
const basicColor: string = 'var(--color-hover)';
const availableColors: string[] = [
  'var(--color-red)',
  'var(--color-blue)',
  'var(--color-green)',
  'var(--color-yellow)',
  'var(--color-white)',
  'var(--color-black)',
];
const shadeColors: string[] = Array.from({ length: 3 }, (_, idx) => [0.4, 0.6, 0.8][idx % 3]).map(
  (i) => `rgba(${basicColor}, ${i})`
);

const _getColorStyle = (s: string) => ({
  background: `linear-gradient(45deg, ${s}, #fff)`,
});

export interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  type?: 'wave' | 'basic';
  color?: 'basic' | 'shade' | 'rainbow';
  shouldAdapt?: boolean;
}

export default function Loader({ size, type, color, shouldAdapt, ...rest }: Props) {
  if (!size) return null;

  //
  const mustAdapt: boolean = shouldAdapt || size > sizeMax;

  // rendering variables
  const { className, ...props } = rest;
  const uniqueId = generateWeakId();

  function renderDot(index: number, key: string) {
    if (!size) return null;
    let findColor: string;
    switch (color) {
      case 'basic':
        findColor = basicColor;
        break;
      case 'shade':
        findColor = shadeColors[index % shadeColors.length];
        break;
      case 'rainbow':
        findColor = availableColors[index % availableColors.length];
        break;
      default:
        findColor = basicColor;
        break;
    }
    console.log('idx', index, ':', index / (mustAdapt ? sizeMax : size));
    const dotStyle = {
      // animationDelay: '1s',
      ..._getColorStyle(findColor),
      animationDelay: `${index === 0 ? 1 : index / (mustAdapt ? sizeMax : size)})s`,
    };
    return <span key={key} className={classNames([styles.dot])} style={dotStyle} />;
  }

  return (
    <div
      className={classNames([styles.spinner, styles[`animation-${type}`], className])}
      {...props}
    >
      {Array.from({ length: size as number }, (_, idx) =>
        renderDot(idx, `loader-dots-${uniqueId}-${idx}`)
      )}
    </div>
  );
}

Loader.defaultProps = {
  size: 3,
  type: 'basic',
  color: 'basic',
  shouldAdapt: false,
};

/*
.spinner span:nth-child(1) {
  animation: fade 1s ease-in-out infinite;
}
*/
