
import React from 'react';
import PropTypes from 'prop-types';
import './upload-drop-zone.css';

const UploadDropZone = () => {

    return (
        <div className="upload-section__dropzone">
            <div className="app__placeholder">Drop your file here!</div>
        </div>
    )
}

export default UploadDropZone;

UploadDropZone.propTypes = {
}