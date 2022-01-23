import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './upload-drop-zone.css';
import DropZone from '../drop-zone/drop-zone';
import axios from "axios";
import { useStore } from '../../store';
import { API_URL } from '../../utils/constants';
import { Document } from '../../services/page-and-document';

// TEST PATH
const _path = "public/uploads/__8497_name_key_0.pdf";
const _path_photo = "public/uploads/test_photo.png";
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

    // 
    const { addDocumentFromUploadFile, addDocument } = useStore();
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
    const createIdFromFile = (file, index) => {
        return `__${(Math.floor(Math.random() * (10000 - 1) + 1))}_name_key_${index}`
    }

    const createFilename = (id, file, index, defaultExtension = ".pdf") => {
        const { name, type } = file
        const extension = defaultExtension
        return `${id}${extension}`
    }
    // addDocumentFromUploadFiles
    const _addDocumentFromUploadFile = (data) => {
        console.log("input DATA", data);
        // TODO fake implementation
        const doc = new Document(data.id, data.path, data.originalFilename, ".pdf", {})
        console.log("doc", doc)
        console.log("numberofPages", doc.numberOfPages)
        doc.numberOfPages = 4;
        console.log("NEW numberofPages", doc.numberOfPages)
        addDocument(doc);
        addDocumentFromUploadFile();

    }

    const _addDocumentFromUploadFiles = (inputs, response) => {
        const { data : { output }} = response;
        console.log("input", inputs);
        console.log("output", output);
        // align everything
        const filterByName = (list, name) => (list.filter(l=> l.filename === name)) 
        const data = (
            inputs
            .map(inp => ({ ...inp, ...filterByName(output, inp.filename)[0]}))
        )
        console.log("data", data)
        data.map(f => _addDocumentFromUploadFile(f));
    }

    // UPLOAD FILES
    const uploadFiles = files => {
        // prepare the download process
        //Clear the error message
        const inputs = [];
        setError("")
        setUploadProgress(initialUploadProgress);
        setUploading(true);

        // initiate formadata
        let formData = new FormData();
        for (const key of Object.keys(files)) {
            const file = files[key]
            const newId = createIdFromFile(file, key);
            const filename = createFilename(newId, file, key);
            formData.append('files', file, filename)
            inputs.push({ id: newId, file: file, originalFilename: file.name, filename: filename })
        }
        console.log(Array.from(formData));

        //send request
        axios({
            url: `${API_URL}/storage`,
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
                _addDocumentFromUploadFiles(inputs, res);
                setSuccessfullUploaded(true);
                setUploading(false);
                setUploadProgress({ pourcentage: 100, state: 'wrong', fileName: null })
            })
            // catch errors
            .catch(error => {
                console.log("&&&&&&&", error);
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