
import React from 'react';
import PropTypes from 'prop-types';
import './upload-list-zone.css';

const UploadListZone = ({documents}) => {

    return (
        <div className="upload-section__list">
            <ul>
                {documents
                    .map(doc => (
                        <li key={doc.id}>Document {doc.id}</li>
                    ))}
            </ul>
        </div>
    )
}

export default UploadListZone;

UploadListZone.propTypes = {
    documents: PropTypes.array,
}