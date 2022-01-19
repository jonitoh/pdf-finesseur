
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './upload-drop-zone.css';
import DropZone from '../drop-zone/drop-zone';


const Progress = ({ progress }) => {
    const state = {};

    return (
        <div className='progress-bar'>
            <div
                className='progress'
                style={{ width: progress + '%' }}
            />
        </div>
    )
}

const UploadDropZone = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [successfullUploaded, setSuccessfullUploaded] = useState(false);
    // à voir ?
    const disabled = uploading;
    const progress = 0;

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
    
    
    */
    const sendRequest = file => {
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
    const uploadFiles = async () => {

        setUploadProgress({});
        setUploading(true);
        const promises = [];
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
        }
    }

    const onFilesAdded = files => (prev => [...prev, ...files]);
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
    }
    
    const renderActions = () => {
        if (successfullUploaded) {
            return (
                <button
                    className='button'
                    onClick={() => {
                        setFiles([]);
                        setSuccessfullUploaded(false);
                    }}
                >
                    Clear
                </button>
            );
        } else {
            return (
                <button
                    disabled={files.length < 0 || uploading}
                    onClick={uploadFiles}
                >
                    Upload
                </button>
            );
        }
    }


    return (
        <div className="upload-section__dropzone upload">
            <span className="title">{uploading ? "Loading..." : "Drop your file here!"}</span>

            <div className='content'>
                <div>
                    <DropZone
                        onFilesAdded={onFilesAdded}
                        disabled={uploading || successfullUploaded}
                    />
                </div>
                <div className='files'>
                    Nada
                </div>
                <div className='actions'>{renderActions()}</div>
            </div>

            <div className="progress">{progress === 0 ? "" : `Progress: ${progress}`}</div>
        </div>
    )
}

export default UploadDropZone;

UploadDropZone.propTypes = {
}