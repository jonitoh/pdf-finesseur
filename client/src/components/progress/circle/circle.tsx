import React from 'react';
import classNames from 'classnames';
import { normalizePercentage, generateInnerText } from '../helpers';
import styles from './circle.module.css';

/* helpers */
const MAX_RADIUS = 50; // Since the view box is 100x100.

function generateDynamicColorClass(percentage: number): string {
  if (percentage <= 25) {
    return 'stroke-good-level';
  }
  if (percentage >= 75) {
    return 'stroke-wrong-level';
  }
  return 'stroke-alright-level';
}

export type Props = {
  percentage: number;
  stroke: number;
  size?: number | string;
  ratio?: number;
  backgroundPadding?: number;
  backgroundExtraSpace?: number;
  innerText?: string | ((percentage: number) => string);
  label?: string | ((percentage: number) => string);
  hasBackground?: boolean;
  hasNumber?: boolean;
  hasRoundEnds?: boolean;
  hasDynamicColorClass?: boolean;
  dynamicColorClass?(percentage: number): string;
};

export default function ProgressCircle({
  percentage,
  stroke,
  size,
  ratio,
  backgroundPadding,
  backgroundExtraSpace,
  innerText,
  label,
  hasBackground,
  hasNumber,
  hasRoundEnds,
  hasDynamicColorClass,
  dynamicColorClass,
}: Props) {
  if (percentage === 0) {
    return null;
  }
  // the different radii
  const backgroundRadius = MAX_RADIUS - (backgroundPadding || 0);
  const radius = backgroundRadius - (backgroundExtraSpace || 0) - stroke / 2;

  // the different circumferences
  const fullCircumference = 2 * Math.PI * radius;
  const circumference = ratio ? ratio * fullCircumference : fullCircumference;

  // To allow a gauge when the ratio is lower than 1
  const angleForRotation = ratio ? Math.round(90 + (360 * (1 - ratio)) / 2) : 90;

  // Some normalizations are necessary
  let _size: string | undefined;
  if (typeof size === 'string') {
    _size = size;
  }
  if (typeof size === 'number') {
    _size = `${size}px`;
  }

  const _percentage = normalizePercentage(percentage);

  const _innerText = innerText instanceof Function ? innerText(_percentage) : innerText;

  const _label = label instanceof Function ? label(_percentage) : label;

  return (
    <div
      className={styles.progress}
      style={
        _size
          ? {
              width: _size,
              height: _size,
            }
          : {}
      }
    >
      {_label ? <h6 className={styles.label}>{_label}</h6> : null}
      <div className={styles.wrapper}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          width="100%"
          height="100%"
          className={styles.svg}
        >
          <circle
            data-id="optional-background"
            className={classNames(hasBackground ? styles.fillBackground : styles.noBackground)}
            r={backgroundRadius}
            cx={50}
            cy={50}
          />
          <circle
            data-id="trail"
            className={classNames([styles.strokeTrail])}
            r={radius}
            cx={50}
            cy={50}
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${fullCircumference}`}
            strokeLinecap={hasRoundEnds ? 'round' : 'butt'}
            transform={`rotate(${angleForRotation} 50 50)`}
          />
          <circle
            data-id="percentage"
            className={classNames([
              styles.strokePercentage,
              hasDynamicColorClass
                ? styles[dynamicColorClass ? dynamicColorClass(_percentage) : '']
                : false,
            ])}
            r={radius}
            cx={50}
            cy={50}
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${fullCircumference}`}
            strokeLinecap={hasRoundEnds ? 'round' : 'butt'}
            transform={`rotate(${angleForRotation} 50 50)`}
            strokeDashoffset={circumference - (_percentage / 100) * circumference}
          />
          {hasNumber ? (
            <g
              className={classNames([
                styles.innerText,
                hasDynamicColorClass
                  ? styles[dynamicColorClass ? dynamicColorClass(_percentage) : '']
                  : false,
              ])}
            >
              <text
                className={styles.number}
                x={50}
                y={40}
                dominantBaseline="middle"
                textAnchor="middle"
              >{`${_percentage}%`}</text>
              <text
                className={styles.optionalText}
                x={50}
                y={55}
                dominantBaseline="middle"
                textAnchor="middle"
              >
                {_innerText}
              </text>
            </g>
          ) : null}
        </svg>
      </div>
    </div>
  );
}

ProgressCircle.defaultProps = {
  size: undefined,
  ratio: 1,
  backgroundPadding: 2,
  backgroundExtraSpace: 2,
  innerText: generateInnerText,
  label: undefined,
  hasBackground: false,
  hasNumber: true,
  hasRoundEnds: false,
  hasDynamicColorClass: false,
  dynamicColorClass: generateDynamicColorClass,
};
