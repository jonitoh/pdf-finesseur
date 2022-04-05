import React, { Fragment } from 'react';
import UploadGrid from '#components/upload-grid/upload-grid';
import UploadDropZone from '#components/upload-drop-zone/upload-drop-zone';
import withInnerNavigation from '#pages/wrapper/options';
import styles from './upload.module.css';

function UploadPage() {
  return (
    <Fragment>
      <UploadGrid />
      <UploadDropZone />
    </Fragment>
  );
}

export default withInnerNavigation(UploadPage, { style: { flexDirection: 'column' } }); // , overflow: "scroll"
