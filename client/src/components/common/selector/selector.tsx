import React, { ChangeEventHandler, SelectHTMLAttributes } from 'react';
import { OptionForSelector } from '#utils/store';
import styles from './selector.module.css';

export interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  defaultOption: OptionForSelector;
  options: OptionForSelector[];
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  unknownLabel?: string;
}

export default function Selector({
  defaultOption,
  options,
  onChange,
  unknownLabel,
  ...rest
}: Props) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.label}>{defaultOption.label}</h3>
      <select className={styles.select} value={defaultOption.value} onChange={onChange} {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label || unknownLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

Selector.defaultProps = {
  onChange: undefined,
  unknownLabel: '???',
};
