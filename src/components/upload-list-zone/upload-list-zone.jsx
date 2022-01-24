import React from 'react';
import PropTypes from 'prop-types';
import './upload-list-zone.css';
import Grid from '../grid/grid-upload';

const UploadListZone = () => {
    return (
        <div className="upload-section__list">
            <Grid/>
        </div>
    )
}

export default UploadListZone;

UploadListZone.propTypes = {
    documents: PropTypes.array,
}