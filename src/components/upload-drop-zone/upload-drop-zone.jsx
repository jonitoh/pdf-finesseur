import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './upload-drop-zone.css';
import DropZone from '../drop-zone/drop-zone';
import axios from "axios";
import { useStore } from '../../store';
import { API_URL } from '../../utils/constants';
import { Document } from '../../services/page-and-document';
import Progress from '../progress/progress';
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
    }
)

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
    const initialUploadProgress = { percentage: 0, state: 'initial', filename: null };
    // state: success, failure, initial, loading
    const [uploadProgress, setUploadProgress] = useState(initialUploadProgress);
    const [successfullUploaded, setSuccessfullUploaded] = useState(false);
    const CustomProgress = withOptionalShow(Progress);

    //
    const [errorMsg, setErrorMsg] = useState("")

    // 
    const { addDocumentFromUploadFile, addDocument, documents } = useStore();


    // helper function
    const initialiseDropZone = () => {
        setUploading(false);
        setUploadProgress(initialUploadProgress);
        setSuccessfullUploaded(false);
        setErrorMsg("");
        // resetProgressBar
    }

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
                                    setErrorMsg("Please select a file before uploading!")
                                    break
                                case "LIMIT_FILE_SIZE":
                                    setErrorMsg("File size is too large. Please upload files below 1MB!")
                                    break
                                case "INVALID_TYPE":
                                    setErrorMsg(
                                        "This file type is not supported! Only .png, .jpg and .jpeg files are allowed"
                                    )
                                    break
                                case "CANT_DELETE":// TODO to remove it is for DELETE
                                    setErrorMsg('Unsuccessful deletion')
                                    break
                                case "UNFOUND_FILE":// TODO to remove it is for DELETE
                                    setErrorMsg('Unfound file during the deletion process')
                                    break
                                default:
                                    setErrorMsg("Sorry! Something went wrong. Please try again later")
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

        const __map = loadingTask.promise.then((pdf) => {
            pdfDOC = pdf;
            numPages = pdfDOC.numPages;
            canvas = document.getElementById("pdf-canvas");
            ctx = canvas.getContext("2d");
            extractPageIntoImg(pageNum);
            return ___mapPageNumberToUrl;
        })
        /*
            .finally((response) => {
                // necessary check
                console.log(">>>>> response", response);
                console.log(">>>>> bagOfURLs", ___mapPageNumberToUrl);
                return ___mapPageNumberToUrl;
            })*/
        console.log(">>>>> direct bagOfUrls", ___mapPageNumberToUrl);
        console.log(">>>>> promised bagOfUrls", __map);
        const accessMap = async (myMap) => {
            const mapping = await myMap;
            console.log(">>>>> bagOfURLs inside accessMap", mapping);
            return mapping;
        };
        const addDocumentFromAsynchronousMap = async (myMap) => {
            // our freaking mapping
            const mapping = await myMap;
            console.log(">>>>> bagOfURLs --- inside async", mapping);

            // create the document
            const doc = new Document(data.id, data.originalFilename, ".pdf", {}, data.path);
            console.log(">>>>> doc instance -- raw --- inside async", doc);

            // add url and numberOfPages
            //mapping[-1] = mapping[1]
            doc.url = mapping[1];//mapping[-1];
            doc.numberOfPages = 4;
            console.log(">>>>> doc instance -- add url --- inside async", doc);

            // add other images
            doc.setMapPageToUrl(mapping);
            console.log(">>>>> doc instance -- final touch --- inside async", doc);
            console.log(">>>>> doc instance -- final final touch --- inside async", doc.getUrl());

            // add the document
            addDocument(doc);
            addDocumentFromUploadFile();
        };
        addDocumentFromAsynchronousMap(__map);
        /*
        // our freaking mapping
        const mapping = accessMap(__map);
        console.log(">>>>> mapping", mapping);
        // create the document
        const doc = new Document(data.id, data.originalFilename, ".pdf", {}, data.path);
        console.log(">>>>> doc instance -- raw", doc);

        // add url and numberOfPages
        mapping[-1] = mapping[1]
        doc.url = mapping[-1];
        doc.numberOfPages = 4;
        console.log(">>>>> doc instance -- add url", doc);

        // add other images
        doc.setMapPageToUrl(mapping);
        console.log(">>>>> doc instance -- final touch", doc);
        console.log(">>>>> doc instance -- final final touch", doc.getUrl());

        // add the document
        addDocument(doc);
        addDocumentFromUploadFile();
        /*
        .then((response) => {
            // necessary check
            console.log(">>>>> response", response);
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
        })*/
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
        setErrorMsg("")
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
                setUploadProgress({ pourcentage: 100, state: 'wrong', filename: null })
            })
            // catch errors
            .catch(error => {
                console.log("&&&&&&&", error);
                const { code } = error?.response?.data
                switch (code) {
                    case "FILE_MISSING":
                        setErrorMsg("Please select a file before uploading!")
                        break
                    case "LIMIT_FILE_SIZE":
                        setErrorMsg("File size is too large. Please upload files below 1MB!")
                        break
                    case "INVALID_TYPE":
                        setErrorMsg(
                            "This file type is not supported! Only .png, .jpg and .jpeg files are allowed"
                        )
                        break
                    case "CANT_DELETE":// TODO to remove it is for DELETE
                        setErrorMsg('Unsuccessful deletion')
                        break
                    case "UNFOUND_FILE":// TODO to remove it is for DELETE
                        setErrorMsg('Unfound file during the deletion process')
                        break
                    default:
                        setErrorMsg("Sorry! Something went wrong. Please try again later")
                        break
                }
                setSuccessfullUploaded(true);
                setUploading(false);
                setUploadProgress({ pourcentage: 100, state: 'wrong', filename: null })
            })
    }
    // upload File to make generic --- 
    const ___uploadFile = files => {
        const msg = '';
        // prepare the download process
        // before -----
        //Clear the error message
        const inputs = [];
        setErrorMsg("")
        setUploadProgress(initialUploadProgress);
        setUploading(true);
        // now -----
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
            // on uploadprogress ---
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
                // ----in case of success
                _addDocumentFromUploadFiles(inputs, res);
                setSuccessfullUploaded(true);
                setUploading(false);
                setUploadProgress({ pourcentage: 100, state: 'wrong', filename: null })
            })
            // catch errors
            .catch(error => {

                msg = "babay"
                console.log("&&&&&&&", error);
                const { code } = error?.response?.data
                switch (code) {
                    case "FILE_MISSING":
                        setErrorMsg("Please select a file before uploading!")
                        break
                    case "LIMIT_FILE_SIZE":
                        setErrorMsg("File size is too large. Please upload files below 1MB!")
                        break
                    case "INVALID_TYPE":
                        setErrorMsg(
                            "This file type is not supported! Only .png, .jpg and .jpeg files are allowed"
                        )
                        break
                    case "CANT_DELETE":// TODO to remove it is for DELETE
                        setErrorMsg('Unsuccessful deletion')
                        break
                    case "UNFOUND_FILE":// TODO to remove it is for DELETE
                        setErrorMsg('Unfound file during the deletion process')
                        break
                    default:
                        setErrorMsg("Sorry! Something went wrong. Please try again later")
                        break
                }
                // -- in case of errors
                setErrorMsg(msg)
                setSuccessfullUploaded(true);
                setUploading(false);
                setUploadProgress({ pourcentage: 100, state: 'wrong', filename: null })
            })
    }

    // _asyncUploadDocument ARGS
    const handleBefore = (file, filename) => {
        setUploadProgress({ ...initialUploadProgress, ...{ filename: filename } });
        setUploading(true);
        return [file, filename]
    }

    const handleOnUploadProgress = progressEvent => {
        const percentage = Math.round((100 * progressEvent.loaded) / progressEvent.total)
        setUploadProgress(prevState => ({ ...prevState, ...{ percentage: percentage, state: 'loading' } }))
    };

    const handleSuccess = (file, filename, response) => {
        //_addDocumentFromUploadFiles(inputs, response);
        setSuccessfullUploaded(true);
        setUploading(false);
        setUploadProgress({ percentage: 100, state: 'success', filename: filename })
        return ""
    }

    const handleCatcher = (file, filename, error) => {
        const errors = genericCatcher(file, filename, error);
        return errors
    }

    const handleValidation = async (file, filename, data) => {
        const awaitedData = await data;
        console.log("awaitedData", awaitedData)
        if (awaitedData) {
            console.log("in error")
            setErrorMsg(prevState => (!!prevState ? prevState + " || " + awaitedData : awaitedData))
            setSuccessfullUploaded(false);// a voir
            setUploadProgress({ percentage: 100, state: 'fail', filename: filename })
        } else {
            console.log("in valid")
            // do something with the awaitedData
            setSuccessfullUploaded(true);
            setUploadProgress({ percentage: 100, state: 'success', filename: filename })
        }
        setUploading(false);
    }

    /////////////////////////////////////////// generic upload to be in utils/api
    const genericFilename = (file, filename) => (!!filename ? filename : file.name)

    const genericSuccess = (file, filename, response) => {
        if (response.status === 200) {
            console.log("everything is ok")
        } else {
            console.log("oups something went wrong")
        }
        return ""
    }

    const genericCatcher = (file, filename, error) => {
        console.log("catched error", error);
        const { code } = error?.response?.data
        switch (code) {
            case "FILE_MISSING":
                return "Please select a file before uploading!"
                break
            case "LIMIT_FILE_SIZE":
                return "File size is too large. Please upload files below 1MB!"
                break
            case "INVALID_TYPE":
                return "This file type is not supported! Only .png, .jpg and .jpeg files are allowed"
                break
            case "CANT_DELETE":// TODO to remove it is for DELETE
                return 'Unsuccessful deletion'
                break
            case "UNFOUND_FILE":// TODO to remove it is for DELETE
                return 'Unfound file during the deletion process'
                break
            default:
                return "Sorry! Something went wrong. Please try again later"
                break
        }
    }

    const genericValidator = (file, filename, data) => {
        console.log("received data in validation", data);
    }

    const uploadFile = async (
        file,
        filename,
        before = (file, filename) => ([file, filename]),
        onUploadProgress = () => { },
        success = (file, filename, response) => { genericSuccess(file, filename, response) },
        catcher = (file, filename, error) => { genericCatcher(file, filename, error) },
        validator = async (file, filename, data) => { genericValidator(file, filename, data) },
    ) => {
        // before process
        [ file, filename ] = before(file, filename);

        // initialisation
        const processedFilename = genericFilename(file, filename);
        let formData = new FormData();
        formData.append('files', file, processedFilename)
        console.log("check formData", Array.from(formData));

        //send request
        const data = await axios({
            url: `${API_URL}/hello-world`,
            method: "GET",
        })/*
        const data = await axios({
            url: `${API_URL}/storage`,
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data',
                //authorization: process.env.SERVER_TOKEN || "token"
            },
            data: formData,
            //onUploadProgress: onUploadProgress,
        })*/
        // handle response
        .then(response => success(file, filename, response))
        // catch errors
        .catch(error => catcher(file, filename, error))
        // final step
        //.finally((response) => return response)
        // handle error
        console.log("value of axios data", data)
        const _data = "";//`unknown error---${processedFilename}`
        await validator(file, filename, _data);
    }
    /////////////////////////////////////////// 
    /*
    file,
    filename,
    before = (file, filename) => ([file, filename]),
    onUploadProgress = () => { },
    success = (file, filename, response) => { genericSuccess(file, filename, response) },
    catcher = (file, filename, error) => { genericCatcher(file, filename, error) },
    validator = (file, filename, data) => { genericValidator(file, filename, data) },*/

    const _asyncUploadDocument = async (file, filename = null) => {
        console.log(`--for the mess about file ${file.name} and optional name ${filename}`);
        await uploadFile(
            file,
            filename,
            handleBefore,//(file, filename) => ([file, filename]),
            () => { },//handleOnUploadProgress,
            (file, filename, response) => { genericSuccess(file, filename, response) },//handleSuccess,
            (file, filename, error) => { genericCatcher(file, filename, error) },//handleCatcher,
            handleValidation,//(file, filename, data) => { genericValidator(file, filename, data) },//
        );
    }

    // ASYNCHRONOUS UPLOADING OF A DOCUMENT
    const asyncUploadDocument = async (file) => {
        // Promise there
        console.log("--treatment of the following file", file.name);
        return new Promise((resolve) => {
            // step one -- upload file
            _asyncUploadDocument(file);
            // return what's important
            resolve(file.name)
        });
    }

    // UPLOAD DOCUMENTS WITH PROMISES
    const uploadDocuments = async (index, files) => {
        // first iteration
        await asyncUploadDocument(files[index])
            .then(response => {
                console.log(`asyncUploadDocument for file number ${index}:\n${response}\n`);
                index++;
                if (index < files.length) {
                    // second iteration
                    uploadDocuments(index, files)
                } else {
                    // end of the loop
                    console.log("End of the upload ---------------")
                    // à voir 
                    setTimeout(() => {
                        console.log("Back to the beginning ---------------")
                        initialiseDropZone();
                    }, 2000);
                }
            })
    }

    // ONFILEADDED
    const onFilesAdded = async files => {
        // start with a fresh new empty error
        setErrorMsg("");
        await uploadDocuments(0, files);
    };

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
            <CustomProgress progress={uploadProgress.percentage} show={showWhenNull} />
            {errorMsg && <div style={{ color: 'red' }}>{errorMsg}</div>}
        </div>
    )
}

export default UploadDropZone;

UploadDropZone.propTypes = {
}