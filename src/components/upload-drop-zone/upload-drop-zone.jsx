import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './upload-drop-zone.css';
import DropZone from '../drop-zone/drop-zone';
import axios from "axios";
import { useStore } from '../../store';
import { API_URL } from '../../utils/constants';
import { Document } from '../../services/page-and-document';
///////// workaround for image extraction
import { pdfjs } from "../../services/pdfjs";
////////

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
/////////////// TODO helper
const createIdFromFile = (file, index) => {
    return `__${(Math.floor(Math.random() * (10000 - 1) + 1))}_name_key_${index}`
}

const createFilename = (id, file, index, defaultExtension = ".pdf") => {
    const { name, type } = file
    const extension = defaultExtension
    return `${id}${extension}`
}

const clearCanvas = (ctx, canvas) => ctx.clearRect(0, 0, canvas.width, canvas.height);


const dataURLtoFile = (dataURL, filename) => {
    // mime extension extraction
    const mimeExtension = dataURL.split(',')[0].split(':')[1].split(';')[0];

    // Extract remaining part of URL and convert it to binary value
    const byteString = window.atob(dataURL.split(',')[1]);

    const blobArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        blobArray[i] = byteString.charCodeAt(i);
    }

    return new File([blobArray], filename, { type: mimeExtension, lastModified: new Date() });
}

const filterByName = (list, name) => (list.filter(l => l.filename === name))

const retrievePath = (output, filename) => {
    const found = filterByName(output, filename)
    const path = found.length === 0 ? "" : found[0]
    return path
}

//////////////
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
    const { addDocumentFromUploadFile, addDocument, documents } = useStore();
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

    // addDocumentFromUploadFiles
    const _addDocumentFromUploadFile = (data) => {
        console.log("input DATA", data);
        // having our main canvas here
        let canvas;
        let ctx;
        let pdfDOC = null;
        let numPages;
        let pageNum = 1;
        let pageRendering = false;

        // extract image right there
        const mimeExtension = "image/jpeg";
        const extension = ".jpg";
        const scale = 0.25;
        const __canvasURLs = {};
        const ___mapPageNumberToUrl = {};

        const extractPageIntoImg = (num) => {
            console.log(">>>>> extractPageIntoImg for page", num)
            pageRendering = true;
            // Fetch the wanted page
            pdfDOC.getPage(num).then((page) => {
                const viewport = page.getViewport({ scale: scale });
                // Prepare canvas using page dimensions                
                canvas.width = viewport.width ? viewport.width : 100;
                canvas.height = viewport.height ? viewport.height : 200;

                // renderTask
                const renderTask = page.render({
                    canvasContext: ctx,
                    viewport: viewport,
                })

                renderTask.promise.then(() => {
                    pageRendering = false;
                    // do stuff here

                    // retrieve the data url
                    console.log(">>>>> valid dataURL? ", !!canvas.toDataURL(mimeExtension))

                    // create a filename
                    const filename = `${data.id}__${num}${extension}`;

                    //File from dataURL
                    const file = dataURLtoFile(canvas.toDataURL(mimeExtension), filename)
                    console.log(">>>>> new File", file);

                    // upload image
                    let formData = new FormData();
                    let url;
                    formData.append('files', file)
                    console.log(">>>>> formdata imgs", Array.from(formData));

                    // use axios to make a POST request
                    axios({
                        url: `${API_URL}/storage`,
                        method: "POST",
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            //authorization: process.env.SERVER_TOKEN || "token"
                        },
                        data: formData,
                    })
                        // handle response
                        .then(response => {
                            if (response.status === 200) {
                                console.log("everything is ok")
                            } else {
                                console.log("oups something might have went wrong")
                            }
                            const { data: { output } } = response;
                            console.log(">>>>> output", output);
                            url = retrievePath(output, filename).path;
                        })
                        // catch errors
                        .catch(error => {
                            console.log(">>>>> img upload error", error);
                            url = "DEFAULT"
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
                        })
                        // final steps
                        .finally(() => {
                            // store the path
                            __canvasURLs[num] = url;
                            ___mapPageNumberToUrl[num] = url;
                        })

                    // end of do stuff here
                    if (pageNum < numPages) {
                        clearCanvas(ctx, canvas);
                        pageNum++;
                        extractPageIntoImg(pageNum)
                    }
                })

                // clear the canvas so that a new image can be put
                clearCanvas(ctx, canvas);
            })

        }

        console.log("\n\n\n\n\n\n");
        console.log(">>>>> start")
        const loadingTask = pdfjs.getDocument(data.path);

        loadingTask.promise.then((pdf) => {
            pdfDOC = pdf;
            numPages = pdfDOC.numPages;
            canvas = document.getElementById("pdf-canvas");
            ctx = canvas.getContext("2d");
            extractPageIntoImg(pageNum);
        })
        .then((response) => {
            // necessary check
            console.log(">>>>> bagOfURLs", ___mapPageNumberToUrl);
            
            // link img to pdf -- by default the first page
            //__canvasURLs["main"] = __canvasURLs[1];
            //___mapPageNumberToUrl = { ...___mapPageNumberToUrl, [-1]: ___mapPageNumberToUrl[1] };
            //console.log(">>>>> bagOfURLs add -1", ___mapPageNumberToUrl);
            
            // create the document
            const doc = new Document(data.id, data.originalFilename, ".pdf", {}, data.path);
            console.log(">>>>> doc instance -- raw", doc);

            // add url and numberOfPages
            doc.url = ___mapPageNumberToUrl[-1];
            doc.numberOfPages = 4;
            console.log(">>>>> doc instance -- add url", doc);

            // add other images
            doc.setMapPageToUrl(___mapPageNumberToUrl);
            console.log(">>>>> doc instance -- final touch", doc);
            console.log(">>>>> doc instance -- final final touch", doc.getUrl());

            // add the document
            addDocument(doc);
            addDocumentFromUploadFile();
        })
    }

    const _addDocumentFromUploadFiles = (inputs, response) => {
        const { data: { output } } = response;
        console.log("input", inputs);
        console.log("output", output);
        // align everything
        const filterByName = (list, name) => (list.filter(l => l.filename === name))
        const data = (
            inputs
                .map(inp => ({ ...inp, ...filterByName(output, inp.filename)[0] }))
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