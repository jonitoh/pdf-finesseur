import React, { Fragment, useCallback, useState } from 'react';
import DropZone from '#common/drop-zone/drop-zone';
import select, { Store as State } from '#store';
import { UrlMapObject } from '#services/page-and-document/document';
import axios from 'axios';
import pdfjsLib, { PDFDocumentProxy, PDFPageProxy } from '#services/pdfjs'; // workaround for PDF-based image extraction
import { manageErrorMessageFromCode, uploadFile } from '#services/api';
import {
  dataURLtoFile,
  generateWeakId as generateId,
  //  generateStrongId as generateId,
  range,
  addDelay,
  addAsyncDelay,
  clearCanvas,
} from '#utils/main';
import ProgressCircle from '#components/progress/circle/circle';
import { FileProgress } from '#components/progress/helpers';
import styles from './upload-drop-zone.module.css';

// ------- extractImagesFromPDF -------
// -- helper functions for uploadExtractedImage
type ExtractedImageResponse = {
  output: { path: string }[];
};

type ExtractedImageResult = UrlMapObject;

function uploadExtractedImage(file: File, filename: string, num: number) {
  return uploadFile<ExtractedImageResponse, ExtractedImageResult>({
    file,
    filename,
    success(f, fname, response) {
      const {
        data: { output },
      } = response;
      const { path: imgUrl } = output[0];
      const result = { numPage: num, url: imgUrl };
      return result;
    },
  });
}

async function extractImagesFromPDF(
  docPath: string,
  docId: string,
  mimeExtension: string = 'image/jpeg',
  extension: string = '.jpg',
  scale: number = 0.25,
  onlyPageNumber: number = -1
): Promise<[UrlMapObject[], number]> {
  // Initiate our main canvas
  const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    throw new Error('HTML element of id `pdf-canvas` not found in the DOM');
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('HTML Canvas from element of id `pdf-canvas` not found in the DOM');
  }
  let pdfDOC: PDFDocumentProxy;
  let numPages: number = 0;
  let isRendering: boolean = false;

  const extractImageFromPDF = (num: number) =>
    pdfDOC.getPage(num).then((page: PDFPageProxy) => {
      const viewport = page.getViewport({ scale });
      // Prepare canvas using page dimensions
      canvas.width = viewport.width ? viewport.width : 100;
      canvas.height = viewport.height ? viewport.height : 200;

      // Render PDF page into canvas context
      const renderTask = page.render({
        canvasContext: ctx,
        viewport,
      });

      // the extraction happens here and output an object with the numPage and the newly created url
      const result = renderTask.promise
        .then(() => {
          // args to upload the extracted image
          const dataUrl = canvas.toDataURL(mimeExtension);
          const imageId = `${docId}-${num}`;
          const imageFilename = `${imageId}${extension}`;
          const imageFile = dataURLtoFile(dataUrl, imageFilename);

          // if successful, we store the url
          return uploadExtractedImage(imageFile, imageFilename, num);
        })
        // clear the canvas so that a new image can be put
        .finally(() => {
          clearCanvas(ctx, canvas);
          isRendering = false;
        });
      return result;
    });

  const extractImageFromPDFWithDelay = (num: number) => {
    console.info('>>>>> start extractImageFromPage for page', num);
    if (isRendering) {
      console.info('we need to delay');
      // we manually wait for the canvas to finish rendering
      const addDelayOnExtractImageFromPDF = addAsyncDelay(extractImageFromPDF, 5000);
      return addDelayOnExtractImageFromPDF(num);
    }
    isRendering = true;
    return extractImageFromPDF(num);
  };

  const loadingTask = pdfjsLib.getDocument(docPath);

  // list of { numPage: numPage or -1 for the pdf , url: url }
  const urlMap = await loadingTask.promise.then((pdf: PDFDocumentProxy) => {
    pdfDOC = pdf;
    numPages = pdfDOC.numPages;

    let pageNumList: number[] = [];
    if (onlyPageNumber !== -1 && onlyPageNumber > numPages) {
      throw new Error(`onlyPageNumber ${onlyPageNumber} out of range 1 to ${numPages}`);
    }
    pageNumList = onlyPageNumber === -1 ? range(1, numPages) : [onlyPageNumber];

    console.info('<<<<< pageNumList', pageNumList);
    return pageNumList
      .map((num) => () => extractImageFromPDFWithDelay(num)) // output a promise to be called
      .reduce(
        (prevPromise, promise) =>
          prevPromise.then((result) =>
            promise().then((value) => (value ? Array.prototype.concat.bind(result)(value) : result))
          ),
        Promise.resolve([]) as Promise<Array<UrlMapObject>>
      );
  });

  console.info('>>>>> numPages', numPages);
  console.info('>>>>> urlMap', urlMap);

  return [urlMap, numPages];
}

async function extractMainImageFromPDF(
  docPath: string,
  urlMap: UrlMapObject[],
  numPages: number,
  defaultUrl: string = ''
) {
  const mainUrl = urlMap.find(({ numPage }) => numPage === 1);
  const url = mainUrl ? mainUrl.url : defaultUrl;
  urlMap.push({ numPage: -1, url });
  if (url === defaultUrl) {
    console.warn("We couldn't find an image for our PDF");
  }
  return urlMap;
}

// ------- asyncUploadDocument -------
// -- helper functions for uploadExtractedImage
type AsyncDocumentResponse = ExtractedImageResponse;
type AsyncDocumentResult = undefined;

// -- Main component --

const selector = (state: State) => ({
  addDocument: state.addDocument,
});

export default function UploadDropZone() {
  // uploading state with progress part
  const [uploading, setUploading] = useState(false);
  const initialUploadProgress: FileProgress = { percentage: 0, state: 'initial', filename: '' };
  const [uploadProgress, setUploadProgress] = useState<FileProgress>(initialUploadProgress);
  const updateUploadProgress = useCallback(
    (update: Partial<FileProgress>) =>
      setUploadProgress((prevState) => ({ ...prevState, ...update })),
    []
  );
  const [successfullUploaded, setSuccessfullUploaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { addDocument } = select(selector);

  // helper function
  function initialiseDropZone() {
    setUploading(false);
    setUploadProgress(initialUploadProgress); // resetProgressBar
    setSuccessfullUploaded(false);
    setErrorMsg('');
  }

  async function addDocumentFromFile(docId: string, docPath: string, docName: string) {
    console.info('<<<<< init addDocumentFromFile');
    // eslint-disable-next-line prefer-const
    let [urlMap, numPages] = await extractImagesFromPDF(docPath, docId);
    urlMap = await extractMainImageFromPDF(docPath, urlMap, numPages);

    console.info('urlMap length ?', urlMap.length);

    const documentArgs = {
      id: docId,
      name: docName,
      path: docPath,
      numPages,
      urlMap,
      url: '',
      extension: '.pdf',
    };
    console.info('documentArgs', documentArgs);

    // add the document
    addDocument(documentArgs);
  }

  async function asyncUploadDocument(file: File, filename?: string) {
    console.info(`<<<<< asyncUploadDocument on file ${file.name} with optional name ${filename}`);

    // --- pseudo-global values
    const docId = generateId();

    uploadFile<AsyncDocumentResponse, AsyncDocumentResult>({
      file,
      filename,
      before(f, fname) {
        updateUploadProgress({ filename: f.name });
        setUploading(true);
        return [f, `${docId}.pdf`];
      },
      onUploadProgress(f, fname) {
        return function onUploadProgress(progressEvent: ProgressEvent) {
          updateUploadProgress({
            percentage: Math.round((100 * progressEvent.loaded) / progressEvent.total),
            state: 'loading',
            filename: file.name,
          });
        };
      },
      success(f, fname, response) {
        const {
          data: { output },
        } = response;
        const { path: docPath } = output[0];
        addDocumentFromFile(docId, docPath, file.name);
        setSuccessfullUploaded(true);
        setUploading(false);
        updateUploadProgress({ percentage: 100, state: 'success', filename: file.name });
        return undefined;
      },
      catcher(f, fname, error) {
        console.info('catched asyncUploadDocument error', error);
        let code: string | undefined;
        if (axios.isAxiosError(error)) {
          code = error?.response?.data?.code;
        }
        const msg = manageErrorMessageFromCode(code);
        console.warn('appropriate error message', msg);
        setErrorMsg((prevState) => (prevState ? `${prevState} || ${msg}` : msg));
        setSuccessfullUploaded(false); // a voir
        setUploadProgress({ percentage: 100, state: 'failure', filename: file.name });
        setUploading(false);
        return undefined;
      },
    }).then(() => {
      console.log('<<<<< end _asyncUploadDocument');
    });
  }

  async function asyncUploadDocumentWithPromise(file: File): Promise<void> {
    return new Promise((resolve) => {
      console.log('<<<<< async upload');
      // step one -- upload file
      asyncUploadDocument(file);
      // return what's important
      resolve();
    });
  }

  async function initialiseDropZoneWithPromise(timing: number = 1500) {
    return addDelay(function func() {
      console.info('<<<<< finish upload all docs');
      console.info('back to the beginning');
      initialiseDropZone();
    }, timing)();
  }

  // UPLOAD DOCUMENTS WITH SEQUENTIAL PROMISES
  async function uploadDocuments(
    files: FileList,
    initialiseTiming: number = 2000,
    delayTiming: number = 5000
  ) {
    console.info('<<<<< how many files to upload ?', files.length);
    let sequentialPromises: (() => Promise<void>)[];
    // between each file, we'll wait a few seconds
    sequentialPromises = Array.from(files)
      .map((file) => [
        () => asyncUploadDocumentWithPromise(file),
        () =>
          addDelay(() => {
            console.log(`add some time between file (${delayTiming}ms)`);
          }, delayTiming)(),
      ])
      .reduce((a, b) => a.concat(b), []);

    sequentialPromises = [
      ...sequentialPromises,
      () => initialiseDropZoneWithPromise(initialiseTiming),
    ];
    console.info('<<<<< how many promises ? ', sequentialPromises.length);
    sequentialPromises.reduce(
      (prevPromise, promise) => prevPromise.then(promise),
      Promise.resolve()
    );
  }

  async function onFilesAdded(files: FileList) {
    // start with a fresh new empty error
    setErrorMsg('');
    await uploadDocuments(files);
  }

  return (
    <Fragment>
      <div className={styles.dropZone}>
        <DropZone
          onFilesAdded={onFilesAdded}
          isDisabled={uploading || successfullUploaded}
          title={uploading ? 'Loading...' : 'Drop your file here!'}
        />
      </div>
      <div className={styles.progressZone}>
        <ProgressCircle
          percentage={uploadProgress.percentage}
          label={uploadProgress.filename}
          stroke={6}
        />
      </div>
      {errorMsg && <div className={styles.errorZone}>{errorMsg}</div>}
    </Fragment>
  );
}
