import React from 'react';
import classNames from 'classnames';
import { normalizePercentage, generateInnerText, generateDynamicColorClass } from '../helpers';
import styles from './bar.module.css';

export type Props = {
  percentage: number;
  stroke: number;
  size?: number | string;
  backgroundPadding?: number;
  innerText?: string | ((percentage: number) => string);
  label?: string | ((percentage: number) => string);
  hasBackground?: boolean;
  hasNumber?: boolean;
  hasRoundEnds?: boolean;
  hasDynamicColorClass?: boolean;
  dynamicColorClass?(percentage: number): string;
};

export default function ProgressBar({
  percentage,
  stroke,
  size,
  backgroundPadding,
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
  // the different strokes
  const backgroundStroke = stroke + (backgroundPadding || 0);

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
          <line
            data-id="optional-background"
            className={classNames(hasBackground ? styles.fillBackground : styles.noBackground)}
            x1={0}
            y1={50}
            x2={100}
            y2={50}
            strokeWidth={backgroundStroke}
            strokeLinecap={hasRoundEnds ? 'round' : 'butt'}
          />
          <line
            data-id="trail"
            className={classNames([styles.strokeTrail])}
            x1={0}
            y1={50}
            x2={100}
            y2={50}
            strokeWidth={stroke}
            strokeLinecap={hasRoundEnds ? 'round' : 'butt'}
          />
          <line
            data-id="percentage"
            className={classNames([
              styles.strokePercentage,
              hasDynamicColorClass
                ? styles[dynamicColorClass ? dynamicColorClass(_percentage) : '']
                : false,
            ])}
            x1={0}
            y1={50}
            x2={_percentage}
            y2={50}
            strokeWidth={stroke}
            strokeLinecap={hasRoundEnds ? 'round' : 'butt'}
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
                y={65}
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

ProgressBar.defaultProps = {
  size: undefined,
  backgroundPadding: 2,
  innerText: generateInnerText,
  label: undefined,
  hasBackground: false,
  hasNumber: true,
  hasRoundEnds: false,
  hasDynamicColorClass: false,
  dynamicColorClass: generateDynamicColorClass,
};
