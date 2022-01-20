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
    const initialUploadProgress = { pourcentage: 0, state: '', fileName: null };
    const [uploadProgress, setUploadProgress] = useState(initialUploadProgress);
    const [successfullUploaded, setSuccessfullUploaded] = useState(false);
    const CustomProgress = withOptionalShow(Progress);

    // UPLOAD ONE FILE
    // --xmlhttp
    const __sendRequest = file => {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();

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

            const formData = new FormData();
            formData.append("file", file, file.name);

            req.open("POST", "http://localhost:8000/upload");
            req.send(formData);
        });
    }

    // UPLOAD FILES
    const uploadFiles = files => {
        // prepare the download process
        setUploadProgress(initialUploadProgress);
        setUploading(true);

        // initiate formadata
        let formData = new FormData();
        formData.append("files", files);http://localhost:5000/express_backend

        //send request
        axios({
            url: `${"http://localhost:5000"}/storage`,
            method: "POST",
            headers: {'Content-Type': 'multipart/form-data' },
            //headers: { authorization: process.env.SERVER_TOKEN || "token" }
            data: formData,
        })
            // handle response
            .then(res => {
                if (res.status === 200) {
                    console.log("everything is ok")
                } else {
                    console.log("oups something went wrong")
                }
                console.log("DROPZONE RES", res)
                setSuccessfullUploaded(true);
                setUploading(false); 
            })
            // catch errors
            .catch(err => {
                console.log("DROPZONE ERR", err)
                setSuccessfullUploaded(true);
                setUploading(false);
                setUploadProgress({ pourcentage: 100, state: 'wrong', fileName: null }) 
            })

        // promises baby
        /*const promises = [];
        files.forEach(file => {
            promises.push(sendRequest(file));
        });
        try {
            await Promise.all(promises);
            setSuccessfullUploaded(true);
            setUploading(false);
        } catch (e) {
            // Not Production ready! Do some error handling here instead...
            setSuccessfullUploaded(true);
            setUploading(false);
        }*/
    }

    //UPLOAD DOCUMENTS
    const uploadDocuments = files => {
        uploadFiles(files);
    }

    // ONFILEADDED
    const onFilesAdded = files => {
        console.log("files added FROM UPLOAD ZONE", files);
        uploadDocuments(files);
    };

    /*
    cf. https://stackoverflow.com/questions/44936028/progress-bar-with-axios
    onUpload = () => {
    const config = {
      onUploadProgress: progressEvent => {
        let { progress } = this.state;
        progress = (progressEvent.loaded / progressEvent.total) * 100;
        this.setState({ progress });
      }
    }

    let formData = new FormData();
    formData.append("file", this.state.uploadFile);
    axios.post('http://your_backend_url/api/v1/upload', formData, config).then(res => {
      if (res.data.status == 200) {
        console.log("done: ", res.data.message);
      }
    }).catch(err => {
      console.log("error: ", err.message);
    })
  }

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
        </div>
    )
}

export default UploadDropZone;

UploadDropZone.propTypes = {
}