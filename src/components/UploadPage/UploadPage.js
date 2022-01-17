
import React from 'react';
import PropTypes from 'prop-types';
import './UploadPage.css';
import Placeholder from '../../components/Placeholder/Placeholder';
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
            <div className="upload-section__list">
                <ul>
                    {documents
                    .map(document => (
                        <li key={document.id}>Document {document.id}</li>
                    ))}
                </ul>
            </div>
            <div className="upload-section__dropzone">
                <div className="app__placeholder">Drop your file here!</div>
            </div>
        </div>
    )
}

export default UploadPage;

UploadPage.propTypes = {
}