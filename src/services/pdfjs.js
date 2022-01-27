/*
Service for extracting images from PDFs in the application.
*/
import { pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = window.location.origin + '/pdf.worker.min.js';

export {
    pdfjs
}