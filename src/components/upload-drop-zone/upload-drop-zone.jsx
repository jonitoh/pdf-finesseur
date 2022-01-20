import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './upload-drop-zone.css';
import DropZone from '../drop-zone/drop-zone';
import axios from "axios";

//
const withOptionalShow = (Component) => (
    ({ show = true, ...props }) => {

        if (!show) {
            return null;
        }
        return (
            <Component {...props} />
        )
    })

// need of a customisation --- just number, circle, bar
const Progress = ({ progress = 0, showWhenNull = true }) => (
    <div className="progress">
        <div className='progress-bar'>
            <div
                className='progress'
            >
                {progress}
            </div>
        </div>
    </div>
)// pour le bar, use style={{ width: progress + '%' }}

Progress.propTypes = {
    progress: PropTypes.number,
    showWhenNull: PropTypes.bool,
}

const UploadDropZone = ({ showWhenNull = true }) => {
    // uploading state with progress part
    const [uploading, setUploading] = useState(false);
    const initialUploadProgress = { pourcentage: 0, state: 'initial' };
    const [uploadProgress, setUploadProgress] = useState(initialUploadProgress);
    const [successfullUploaded, setSuccessfullUploaded] = useState(false);
    const CustomProgress = withOptionalShow(Progress);

    //
    const [error, setError] = useState()

    // UPLOAD ONE FILE -- add event listener
    /*
    req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
            const copy = { ...uploadProgress };
            copy[file.name] = {
                state: "pending",
                percentage: (event.loaded / event.total) * 100
            };
            setUploadProgress(copy);
        }
    });

    req.upload.addEventListener("load", event => {
        const copy = { ...uploadProgress };
        copy[file.name] = { state: "done", percentage: 100 };
        setUploadProgress(copy);
        resolve(req.response);
    });

    req.upload.addEventListener("error", event => {
        const copy = { ...uploadProgress };
        copy[file.name] = { state: "error", percentage: 0 };
        this.setUploadProgress(copy);
        reject(req.response);
    });
    */

    // UPLOAD FILES
    const uploadFiles = files => {
        // prepare the download process
        //Clear the error message
        setError("")
        setUploadProgress(initialUploadProgress);
        setUploading(true);

        // initiate formadata
        let formData = new FormData();
        for (const key of Object.keys(files)) {
            formData.append('files', files[key], `name_key_${key}`)
        }
        console.log(Array.from(formData));

        //send request
        axios({
            url: `${"http://localhost:5000"}/storage`,
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data',
                //authorization: process.env.SERVER_TOKEN || "token"
            },
            data: formData,
            onUploadProgress: data => {
                const percentage = Math.round((100 * data.loaded) / data.total)
                setUploadProgress({ pourcentage: percentage, state: 'loading' })
            },
        })
            // handle response
            .then(res => {
                if (res.status === 200) {
                    console.log("everything is ok")
                } else {
                    console.log("oups something went wrong")
                }
                setSuccessfullUploaded(true);
                setUploading(false);
                setUploadProgress({ pourcentage: 100, state: 'wrong', fileName: null })
            })
            // catch errors
            .catch(error => {
                const { code } = error?.response?.data
                switch (code) {
                    case "FILE_MISSING":
                        setError("Please select a file before uploading!")
                        break
                    case "LIMIT_FILE_SIZE":
                        setError("File size is too large. Please upload files below 1MB!")
                        break
                    case "INVALID_TYPE":
                        setError(
                            "This file type is not supported! Only .png, .jpg and .jpeg files are allowed"
                        )
                        break
                    case "CANT_DELETE":// TODO to remove it is for DELETE
                        setError('Unsuccessful deletion')
                        break
                    case "UNFOUND_FILE":// TODO to remove it is for DELETE
                        setError('Unfound file during the deletion process')
                        break
                    default:
                        setError("Sorry! Something went wrong. Please try again later")
                        break
                }
                setSuccessfullUploaded(true);
                setUploading(false);
                setUploadProgress({ pourcentage: 100, state: 'wrong', fileName: null })
            })
    }

    //UPLOAD DOCUMENTS
    const uploadDocuments = files => {
        // TODO 
        uploadFiles(files);
    }

    // ONFILEADDED
    const onFilesAdded = files => {
        uploadDocuments(files);
    };

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

    return (
        <div className="upload-section__dropzone">
            <span className="title">{uploading ? "Loading..." : "Drop your file here!"}</span>

            <div className='content'>
                <div>
                    <DropZone
                        onFilesAdded={onFilesAdded}
                        disabled={uploading || successfullUploaded}
                        title={"upload here!!"}
                    />
                </div>
            </div>
            <CustomProgress progress={uploadProgress.pourcentage} show={showWhenNull} />
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    )
}

export default UploadDropZone;

UploadDropZone.propTypes = {
}