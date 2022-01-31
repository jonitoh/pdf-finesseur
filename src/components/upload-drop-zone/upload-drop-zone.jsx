import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './upload-drop-zone.scoped.css';
import DropZone from '@common/drop-zone/drop-zone';
import Progress from '@components/progress/progress';
import { withOptionalShow } from "@common/options"
import { useStore } from '@store';
import { pdfjs } from "@services/pdfjs"; // workaround for PDF-based image extraction 
import { manageErrorMessageFromCode, uploadFile } from "@services/api";
import { dataURLtoFile } from '@utils/functions';

const range = (start, end, length = end - start + 1) =>
    Array.from({ length }, (_, i) => start + i)

const UploadDropZone = ({ showProgressWhenNull = false }) => {
    // uploading state with progress part
    const [uploading, setUploading] = useState(false);
    const initialUploadProgress = { percentage: 0, state: 'initial', filename: "" };
    const [uploadProgress, setUploadProgress] = useState(initialUploadProgress);
    const [successfullUploaded, setSuccessfullUploaded] = useState(false);
    const [errorMsg, setErrorMsg] = useState("")

    const { addDocument } = useStore();

    const CustomProgress = withOptionalShow(Progress);

    // helper function
    const initialiseDropZone = () => {
        setUploading(false);
        setUploadProgress(initialUploadProgress);
        setSuccessfullUploaded(false);
        setErrorMsg("");
        // resetProgressBar
    }

    const clearCanvas = (ctx, canvas) => {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
    }

    //
    const extractImagesFromPDF = async (docPath, docId, mimeExtension = "image/jpeg", extension = ".jpg", scale = 0.25, onlyPageNumber = null) => {
        // Initiate our main canvas
        const canvas = document.getElementById("pdf-canvas");
        const ctx = canvas.getContext("2d");
        let pdfDOC = null;
        let numPages = null;
        let isRendering = false;

        const extractImageFromPDF = (num) => {
            console.log(">>>>> start extractImageFromPage for page", num);
            if (isRendering) {
                console.log("we need to delay")
                // we manually wait for the canvas to finish rendering 
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(extractImageFromPDF(num))
                    }, 5000);
                });
            }
            isRendering = true;
            return pdfDOC.getPage(num).then((page) => {

                const viewport = page.getViewport({ scale: scale });
                // Prepare canvas using page dimensions                
                canvas.width = viewport.width ? viewport.width : 100;
                canvas.height = viewport.height ? viewport.height : 200;

                // Render PDF page into canvas context
                const renderTask = page.render({
                    canvasContext: ctx,
                    viewport: viewport,
                })

                // the extraction happens here and output an object with the numPage and the newly created url
                const result = renderTask.promise
                    .then(() => {
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
                                const result = { numPage: num, url: imgUrl };
                                return result
                            }

                            return await uploadFile({
                                file: imageFile,
                                filename: imageFilename,
                                success: imageHandleSuccess,
                                returnResult: true,
                            });
                        }

                        return uploadImage(imageFile, imageFilename);

                    })
                    // clear the canvas so that a new image can be put
                    .finally(() => {
                        clearCanvas(ctx, canvas);
                        isRendering = false;
                    })
                return result
            })
        }

        const loadingTask = pdfjs.getDocument(docPath);

        //list of { numPage: numPage or -1 for the pdf , url: url }
        const urlMap = await loadingTask.promise.then((pdf) => {
            pdfDOC = pdf;
            numPages = pdfDOC.numPages;

            let pageNumList = [];
            if (onlyPageNumber) {
                if (onlyPageNumber <= numPages) {
                    pageNumList = [onlyPageNumber]
                } else {
                    throw new Error(`onlyPageNumber ${onlyPageNumber} out of range 1 to ${numPages}`)
                }
            } else {
                pageNumList = range(1, numPages);
            }
            console.log("<<<<< pageNumList", pageNumList);
            return (
                pageNumList
                    .map(num => () => extractImageFromPDF(num))// output a promise to be called
                    .reduce(
                        (prevPromise, promise) => (prevPromise.then(result => promise().then(Array.prototype.concat.bind(result)))),
                        Promise.resolve([]))
            );
        })
        console.log(">>>>> urlMap", urlMap);
        console.log(">>>>> numPages", numPages);

        return [urlMap, numPages]
    }

    const extractMainImageFromPDF = async (docPath, urlMap, numPages) => {
        const mainUrl = urlMap.find(({ numPage }) => numPage === 1)
        const url = mainUrl ? mainUrl.url : ""
        if (url) {
            urlMap.push({ numPage: -1, url: url });
        } else {
            console.log("We couldn't find an image for our PDF")
        }
        return urlMap;
    }

    const addDocumentFromFile = async (docId, docPath, docName) => {
        console.log("<<<<< init addDocumentFromFile");
        let [urlMap, numPages] = await extractImagesFromPDF(docPath, docId);
        //urlMap = await extractMainImageFromPDF(docPath, urlMap, numPages)

        console.log("urlMap length ?", urlMap.length)

        const documentArgs = {
            id: docId,
            name: docName,
            path: docPath,
            numPages: numPages,
            urlMap: urlMap,
            url: "",
            extension: ".pdf"
        };
        console.log("documentArgs", documentArgs);

        // add the document
        addDocument(documentArgs);
    }

    const asyncUploadDocument = async (file, filename = null) => {
        console.log(`<<<<< init _asyncUploadDocument about file ${file.name} and optional name ${filename}`);

        // --- pseudo-global values
        const docId = Math.floor(Math.random() * (10000 - 1) + 1);

        // --- handlers for the uploadFile
        const handleBefore = (file, filename) => {
            setUploadProgress({ ...initialUploadProgress, ...{ filename: file.name } });
            setUploading(true);
            return [file, `${docId}.pdf`]
        }

        const handleOnUploadProgress = (file, filename) => ((progressEvent) => {
            const percentage = Math.round((100 * progressEvent.loaded) / progressEvent.total)
            setUploadProgress({ percentage: percentage, state: 'loading', filename: file.name })
        });

        const handleCatcher = (file, filename, error) => {
            console.log("<<<<< catched _asyncUploadDocument error", error);
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
        }).then(() => {
            console.log("<<<<< end _asyncUploadDocument")
        });
    }

    // ASYNCHRONOUS UPLOADING OF A DOCUMENT
    const asyncUploadDocumentWithPromise = async (file) => {
        return new Promise((resolve) => {
            console.log("<<<<< async upload");
            // step one -- upload file
            asyncUploadDocument(file);
            // return what's important
            resolve()
        });
    }

    const initialiseDropZoneWithPromise = async (timing = 1500) => {
        return new Promise((resolve) => {
            console.log("<<<<< finish upload all docs");
            setTimeout(() => {
                console.log("BACK TO THE BEGINNING")
                initialiseDropZone();
            }, timing);
            // return what's important
            resolve()
        });
    }

    const delayWithPromise = async (timing = 1000) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("delay between files")
            }, timing);
            // return what's important
            resolve()
        });
    }

    // UPLOAD DOCUMENTS WITH SEQUENTIAL PROMISES
    const uploadDocuments = async (files, initialiseTiming = 2000, delayTiming = 5000) => {
        // files is a FileList type
        console.log("<<<<< how many files to upload ?", files.length);
        // between each file, we'll wait a few seconds
        const filesPromises = (
            Array.from(files)
                .map(file => [() => asyncUploadDocumentWithPromise(file), () => delayWithPromise(delayTiming)])
                .reduce((a, b) => (a.concat(b)), [])
        )

        const sequentialPromises = [
            ...filesPromises,
            () => initialiseDropZoneWithPromise(initialiseTiming)
        ]
        console.log("<<<<< how many promises ? ", sequentialPromises.length);
        (
            sequentialPromises
                .reduce(
                    (prevPromise, promise) => (prevPromise.then(result => promise().then(Array.prototype.concat.bind(result)))),
                    Promise.resolve([]))
        );
    }

    // ONFILEADDED
    const onFilesAdded = async files => {
        // start with a fresh new empty error
        setErrorMsg("");
        await uploadDocuments(files);
    };

    return (
        <div className="container">
            <div className="main-content">
                <div className="drop-zone">
                    <DropZone
                        onFilesAdded={onFilesAdded}
                        disabled={uploading || successfullUploaded}
                        title={uploading ? "Loading..." : "Drop your file here!"}
                    />
                </div>
                <div className="progress-zone">
                    <CustomProgress progress={uploadProgress.percentage} show={showProgressWhenNull} />
                </div>
            </div>
            {errorMsg && <div className="error-zone">{errorMsg}</div>}
        </div>
    )
}

export default UploadDropZone;

UploadDropZone.propTypes = {
    showWhenNull: PropTypes.bool,
}