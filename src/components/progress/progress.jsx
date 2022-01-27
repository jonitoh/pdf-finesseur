import React from 'react';
import PropTypes from 'prop-types';
import './progress.css';

// state: success, failure, initial, loading
const initialUploadProgress = { percentage: 0, state: 'initial', filename: null };
// need of a customisation --- just number, circle, bar
const Progress = ({ progress = 0 }) => (
    <div className="progress">
        <div className='progress-bar'>
            <div
                className='progress'
            >
                {progress}
            </div>
        </div>
    </div>
)
// pour le bar, use style={{ width: progress + '%' }}
/*
const renderProgress = file => {
    const _uploadProgress = uploadProgress[file.name];
    if (uploading || successfullUploaded) {
        return (
            <div className="progress-wrapper">
                <Progress progress={_uploadProgress ? _uploadProgress.percentage : 0} />
                <img
                    className="check-icon"
                    alt="done"
                    src="baseline-check_circle_outline-24px.svg"
                    style={{
                        opacity:
                            _uploadProgress && _uploadProgress.state === "done" ? 0.5 : 0
                    }}
                />
            </div>
        );
    }
}*/

export default Progress;

Progress.propTypes = {
    progress: PropTypes.number,
}