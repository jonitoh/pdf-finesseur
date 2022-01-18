
import React from 'react';
import PropTypes from 'prop-types';
import './upload-list-zone.css';

const UploadListZone = ({documents}) => {

    return (
        <div className="upload-section__list">
            <ul>
                {documents
                    .map(document => (
                        <li key={document.id}>Document {document.id}</li>
                    ))}
            </ul>
        </div>
    )
}

export default UploadListZone;

UploadListZone.propTypes = {
    documents: PropTypes.array,
}