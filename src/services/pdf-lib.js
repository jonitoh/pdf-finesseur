/*
Service for creating new PDFs in the application.
*/
import { PDFDocument } from 'pdf-lib';

const loadPDF = async url => {
    const pdfBytes = await fetch(url).then(res => res.arrayBuffer())
    return await PDFDocument.load(pdfBytes)
}

const loadDocuments = async documents => {
    let loadedDocuments = [];
    for (const document of documents ) {
        const loadedDocument = await loadPDF(document.path)
        loadedDocuments.push([ document.id, loadedDocument ])    
    }
    loadedDocuments = Object.fromEntries(loadedDocuments)
    return loadedDocuments
}

const extractWantedPage = async (pdfDoc, pdfDocuments, pageArgs) => {
    const { docId, numPage } = pageArgs;
    const wantedPdfDocument = pdfDocuments[docId];
    // Page numbering starts at 0 in pdf-lib
    const [wantedPage] = await pdfDoc.copyPages(wantedPdfDocument, [numPage - 1]);
    return wantedPage
}

const setDocumentMetadata = (pdfDoc) => {
    // Note that these fields are visible in the "Document Properties" section of 
    // most PDF readers.
    pdfDoc.setTitle('Merged document from PDF Finesseur')
    pdfDoc.setAuthor('PDF Finesseur')
    pdfDoc.setSubject('An epic PDF created by PDF Finesseur')
    pdfDoc.setKeywords(['pdf', 'merge'])
    pdfDoc.setProducer('PDF Finesseur')
    pdfDoc.setCreator('pdf-finesseur (https://github.com/jonitoh/pdf-finesseur)')
    pdfDoc.setCreationDate(new Date())
    pdfDoc.setModificationDate(new Date())

    return pdfDoc;
}

// Serialize the PDFDocument to bytes (a Uint8Array)
const createMergedDocumentAsPdfBytes = async (documents, pages, setMetadata = true) => {
    // create the merged document
    let mergedPdfDoc = await PDFDocument.create();

    // load our documents
    const pdfDocuments = await loadDocuments(documents)

    // add the pages to the merged document
    for (let index = 0; index < pages.length; index++) {
        // extract the wanted page
        const wantedPage = await extractWantedPage(mergedPdfDoc, pdfDocuments, pages[index])
        mergedPdfDoc.addPage(wantedPage)
    }

    // set metadata
    if (setMetadata) {
        mergedPdfDoc = setDocumentMetadata(mergedPdfDoc)
    }

    // save the merged document
    const pdfBytes = await mergedPdfDoc.save()

    return pdfBytes
}

export {
    createMergedDocumentAsPdfBytes
}