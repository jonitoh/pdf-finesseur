
import React from 'react';
import PropTypes from 'prop-types';
import './upload-page.css';
import Placeholder from '../../components/placeholder/placeholder';
import UploadListZone from '../../components/upload-list-zone/upload-list-zone';
import UploadDropZone from '../../components/upload-drop-zone/upload-drop-zone';
import { withInnerNavigation } from '../page-wrapper/page-wrapper';
import { useStore } from '../../store';

const UploadPage = () => {

    const { getNumberOfDocuments, documents } = useStore();

    if (getNumberOfDocuments() === 0) {
        return (
            <Placeholder>
                Go upload some Files!
            </Placeholder>
        )
    }
    return (
        <div className="upload-section">
            <UploadListZone documents={documents} />
            <UploadDropZone/>
        </div>
    )
}

export default withInnerNavigation(UploadPage);

UploadPage.propTypes = {
}