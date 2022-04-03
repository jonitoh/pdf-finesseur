import React, { ComponentType } from 'react';
import Add from '#assets/icons/add-file.svg';
import Close from '#assets/icons/close-button.svg';
import CloudUpload from '#assets/icons/cloud-upload.svg';
import DotsVertical from '#assets/icons/dots-vertical.svg';
import Download from '#assets/icons/download.svg';
import Info from '#assets/icons/information.svg';
import NavBackArrow from '#assets/icons/navigation-back-arrow.svg';
import Settings from '#assets/icons/settings.svg';
import Bin from '#assets/icons/trash-bin.svg';
import Warning from '#assets/icons/warning.svg';
import styles from './style.module.css';

interface Props {
  notificationCount?: number;
}

const defaultProps = {
  notificationCount: 0,
};

// Wrapper for notification
function withNotification<T extends object>(Component: ComponentType<T>) {
  function Wrapper(props: T & Props) {
    const { notificationCount, ...rest } = props;

    if (notificationCount === 0 || !notificationCount) {
      return <Component {...(rest as T)} />;
    }

    return (
      <div className={styles.wrapper}>
        <Component {...(rest as T)} />
        <div className={styles.indicator}>
          <div className={styles.count} role="status">
            {notificationCount > 99 ? '+99' : notificationCount}
          </div>
        </div>
      </div>
    );
  }

  Wrapper.defaultProps = {
    // ...Component.defaultProps,
    ...defaultProps,
  };

  return Wrapper;
}

export default {
  Add: withNotification(Add),
  Close: withNotification(Close),
  CloudUpload: withNotification(CloudUpload),
  DotsVertical: withNotification(DotsVertical),
  Download: withNotification(Download),
  Info: withNotification(Info),
  NavBackArrow: withNotification(NavBackArrow),
  Settings: withNotification(Settings),
  Bin: withNotification(Bin),
  Warning: withNotification(Warning),
};
