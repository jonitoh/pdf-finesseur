import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './upload-drop-zone.css';
import DropZone from '../drop-zone/drop-zone';
import Progress from '../progress/progress';
import { withOptionalShow } from "../common/options"
import { useStore } from '../../store';
import { pdfjs } from "../../services/pdfjs"; // workaround for PDF-based image extraction 
import { Document, __Document } from '../../services/page-and-document';
import { manageErrorMessageFromCode, uploadFile } from "../../services/api";

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

const UploadDropZone = ({ showProgressWhenNull = true }) => {
    // uploading state with progress part
    const [uploading, setUploading] = useState(false);
    const initialUploadProgress = { percentage: 0, state: 'initial', filename: "" };// state: success, failure, initial, loading
    const [uploadProgress, setUploadProgress] = useState(initialUploadProgress);
    const [successfullUploaded, setSuccessfullUploaded] = useState(false);
    const [errorMsg, setErrorMsg] = useState("")

    const { addDocument } = useStore(); // addNewDocument

    const CustomProgress = withOptionalShow(Progress);

    // helper function
    const initialiseDropZone = () => {
        setUploading(false);
        setUploadProgress(initialUploadProgress);
        setSuccessfullUploaded(false);
        setErrorMsg("");
        // resetProgressBar
    }

    const clearCanvas = (ctx, canvas) => ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const extractMainImageFromPDF = (mapping, withReturn = false) => {
        const mainUrl = mapping.find(({numPage}) => numPage === 1)
        const url = mainUrl? mainUrl.url : "" 
        if (url) {
            mapping.push({ numPage: -1, url: url});
        } else {
            console.log("We couldn't find an image for our PDF")
        }
        if (withReturn) {
            return mapping
        }
        return; 
    }
    //
    const extractImagesFromPDF = async (docPath, docId, mimeExtension = "image/jpeg", extension = ".jpg", scale = 0.25, onlyPageNumber = null) => {
        // initiate our return
        let urlMap = [];// list of { numPage: numPage or -1 for the pdf , url: url }

        // Initiate our main canvas
        let canvas;
        let ctx;
        let pdfDOC = null;
        let numPages;
        const stopExtracting = !!onlyPageNumber;
        let pageNum = !!onlyPageNumber ? onlyPageNumber : 1;
        let pageRendering = false;

        // 
        const extractImageFromPage = (num, stopExtracting = false) => {
            console.log(">>>>> start extractImageFromPage for page", num)
            pageRendering = true;
            // retrieve the wanted page
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

                // the extraction happens here
                renderTask.promise.then(() => {
                    pageRendering = false;

                    // args to upload the extracted image
                    const dataUrl = canvas.toDataURL(mimeExtension);
                    const imageId = `${docId}-${num}`;
                    const imageFilename = `${imageId}${extension}`;
                    const imageFile = dataURLtoFile(dataUrl, imageFilename)

                    // upload the extracted image
                    const uploadImage = async (file, filename) => {
                        // store the url
                        const imageHandleSuccess = (file, filename, response) => {
                            const { data: { output } } = response;
                            const { path: imgUrl } = output[0];
                            urlMap.push({ numPage: num, url: imgUrl});
                        }

                        await uploadFile({
                            file: imageFile,
                            filename: imageFilename,
                            success: imageHandleSuccess,
                        });
                    }
                    uploadImage(imageFile, imageFilename);

                    // extract the next image if possible
                    if ((pageNum < numPages) & !stopExtracting) {
                        clearCanvas(ctx, canvas);
                        pageNum++;
                        extractImageFromPage(pageNum)
                    }
                })

                // clear the canvas so that a new image can be put
                clearCanvas(ctx, canvas);

            })
        }

        const loadingTask = pdfjs.getDocument(docPath);

        [urlMap, numPages] = await loadingTask.promise.then((pdf) => {
            pdfDOC = pdf;
            numPages = pdfDOC.numPages;
            canvas = document.getElementById("pdf-canvas");
            ctx = canvas.getContext("2d");
            extractImageFromPage(pageNum, stopExtracting);
            //extractMainImageFromPDF(urlMap, false);
            return [urlMap, numPages]
        })
        // link an image to the PDF as a whole
        console.log(">>>>> urlMap", urlMap);
        console.log(">>>>> numPages", numPages);

        return [urlMap, numPages]
    }

    const addDocumentFromFile = async (docId, docPath, docName) => {
        const [urlMap, numPages] = await extractImagesFromPDF(docPath, docId);



        // addNewDocument
        console.log("========= urlMap", urlMap)
        console.log("========= length urlMap", urlMap.length)
        console.log("========= numPages", numPages)

        //const mainPage = urlMap.find(({numPage}) => numPage === 1)
        //console.log("========= mainPage", urlMap.find(({numPage}) => numPage === 1))
        // create the document
        const doc = new __Document(docId, docName, docPath, numPages, urlMap, "");

        //const z = doc.urlMap.filter(u => u.numPage == 1);
        //console.log("z", z);//[0].url;
        
        doc.numberOfPages = 4;
        //console.log(">>>>> doc instance -- add url --- inside async", doc);

        // add the document
        addDocument(doc);
    }

    ///////////////////////////////////////////

    const _asyncUploadDocument = async (file, filename = null) => {
        console.log(`--for the mess about file ${file.name} and optional name ${filename}`);

        // --- pseudo-global values
        const docId = Math.floor(Math.random() * (10000 - 1) + 1);

        // --- handlers for the uploadFile
        const handleBefore = (file, filename) => {
            setUploadProgress({ ...initialUploadProgress, ...{ filename: file.name } });
            setUploading(true);
            return [file, `${docId}.pdf`]
        }

        const handleOnUploadProgress = (file, filename) => ( (progressEvent) => {
            const percentage = Math.round((100 * progressEvent.loaded) / progressEvent.total)
            setUploadProgress({ percentage: percentage, state: 'loading', filename: file.name })
        });

        const handleCatcher = (file, filename, error) => {
            console.log("catched error", error);
            const { code } = error?.response?.data;
            const msg = manageErrorMessageFromCode(code);
            setErrorMsg(prevState => (!!prevState ? prevState + " || " + msg : msg))
            setSuccessfullUploaded(false);// a voir
            setUploadProgress({ percentage: 100, state: 'fail', filename: file.name })
            setUploading(false);
        }

        const handleSuccess = (file, filename, response) => {
            const { data: { output } } = response;
            const { path: docPath } = output[0];
            addDocumentFromFile(docId, docPath, file.name);
            setSuccessfullUploaded(true);
            setUploading(false);
            setUploadProgress({ percentage: 100, state: 'success', filename: file.name })
        }

        await uploadFile({
            file: file,
            filename: filename,
            before: handleBefore,
            onUploadProgress: handleOnUploadProgress,
            success: handleSuccess,
            catcher: handleCatcher,
        });
    }

    // ASYNCHRONOUS UPLOADING OF A DOCUMENT
    const asyncUploadDocument = async (file) => {
        return new Promise((resolve) => {
            // step one -- upload file
            _asyncUploadDocument(file);
            // return what's important
            resolve()
        });
    }

    // UPLOAD DOCUMENTS WITH PROMISES
    const uploadDocuments = async (index, files) => {
        // first iteration
        await asyncUploadDocument(files[index])
            .then(response => {
                index++;
                if (index < files.length) {
                    // second iteration
                    uploadDocuments(index, files)
                } else { 
                    setTimeout(() => {
                        console.log("BACK TO THE BEGINNING")
                        initialiseDropZone();
                    }, 1500);
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
            <CustomProgress progress={uploadProgress.percentage} show={showProgressWhenNull} />
            {errorMsg && <div style={{ color: 'red' }}>{errorMsg}</div>}
        </div>
    )
}

export default UploadDropZone;

UploadDropZone.propTypes = {
    showWhenNull: PropTypes.bool,
}