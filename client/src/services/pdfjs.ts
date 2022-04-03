/*
Service for extracting images from PDFs in the application.
*/
import pdfjsLib, { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

// pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;

export default pdfjsLib;

export { PDFDocumentProxy, PDFPageProxy };
