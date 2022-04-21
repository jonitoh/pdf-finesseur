import React from 'react';
import Placeholder from '#common/placeholder/placeholder';
import Loader, { Props as LoaderProps } from '#common/loaders/dots/dots';
import styles from './app.module.css';

export interface Props extends LoaderProps {}

export default function FallbackLoader(props: Props) {
  return (
    <div className={styles.app}>
      <Placeholder>
        <Loader {...props} />
      </Placeholder>
    </div>
  );
}

FallbackLoader.defaultProps = {
  t: undefined,
};
