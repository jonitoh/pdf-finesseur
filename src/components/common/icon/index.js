import React from 'react';
import { ReactComponent as _Add } from '@assets/icons/add-file.svg';
import { ReactComponent as _Close } from '@assets/icons/close-button.svg';
import { ReactComponent as _CloudUpload } from '@assets/icons/cloud-upload.svg';
import { ReactComponent as _DotsVertical } from '@assets/icons/dots-vertical.svg';
import { ReactComponent as _Download } from '@assets/icons/download.svg';
import { ReactComponent as _Info } from '@assets/icons/information.svg';
import { ReactComponent as _NavBackArrow } from '@assets/icons/navigation-back-arrow.svg';
import { ReactComponent as _Settings } from '@assets/icons/settings.svg';
import { ReactComponent as _Bin } from '@assets/icons/trash-bin.svg';
import { ReactComponent as _Warning } from '@assets/icons/warning.svg';
import './style.scoped.css';

// Wrapper for notification  
const withNotification = (IconComponent) => (
    ({ notificationCount = 0, ...props }) => {

    if (notificationCount === 0) {
        return <IconComponent {...props}/>;
    }

    return (
        <div className="notification-wrapper">
            <IconComponent {...props}/>
            <div className="notification-indicator">
                <div className="notification-count" role="status">
                    {notificationCount > 99 ? '+99' : notificationCount}
                </div>
            </div>
        </div>
    )
})

const Add = withNotification(_Add);
const Close = withNotification(_Close);
const CloudUpload = withNotification(_CloudUpload);
const DotsVertical = withNotification(_DotsVertical);
const Download = withNotification(_Download);
const Info = withNotification(_Info);
const NavBackArrow = withNotification(_NavBackArrow);
const Settings = withNotification(_Settings);
const Bin = withNotification(_Bin);
const Warning = withNotification(_Warning);

export default {
    Add,
    Close,
    CloudUpload,
    DotsVertical,
    Download,
    Info,
    NavBackArrow,
    Settings,
    Bin,
    Warning
};


