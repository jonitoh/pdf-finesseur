
import React from 'react';
import PropTypes from 'prop-types';
import './upload-page.scoped.css';
import UploadGrid from '@components/upload-grid/upload-grid';
import UploadDropZone from '@components/upload-drop-zone/upload-drop-zone';
import { withInnerNavigation } from '@pages/page-wrapper/page-wrapper';

const UploadPage = () => {

    return (
        <React.Fragment>
            <UploadGrid/>
            <UploadDropZone/>
        </React.Fragment>
    )
}

export default withInnerNavigation(UploadPage,{ containerStyle: { flexDirection: "column"}});//, overflow: "scroll"

UploadPage.propTypes = {
}