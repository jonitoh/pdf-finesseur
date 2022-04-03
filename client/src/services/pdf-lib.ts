/*
Service for creating new PDFs in the application.
*/
import { PDFDocument } from 'pdf-lib';
import Doc from './page-and-document/document';
import Page from './page-and-document/page';

async function loadPDF(url: string) {
  const pdfBytes = await fetch(url).then((res) => res.arrayBuffer());
  return PDFDocument.load(pdfBytes);
}

async function loadDocuments(documents: Doc[]): Promise<Record<string, PDFDocument>> {
  const loadedDocuments: [string, PDFDocument][] = [];
  for (let index = 0; index < documents.length; index += 1) {
    const document = documents[index];
    // eslint-disable-next-line no-await-in-loop
    const loadedDocument = await loadPDF(document.path);
    loadedDocuments.push([document.id, loadedDocument]);
  }
  return Object.fromEntries(loadedDocuments);
}

async function extractWantedPage(
  pdfDoc: PDFDocument,
  pdfDocuments: Record<string, PDFDocument>,
  pageArgs: { docId: string; numPage: number }
) {
  const { docId, numPage } = pageArgs;
  const wantedPdfDocument = pdfDocuments[docId];
  // Page numbering starts at 0 in pdf-lib
  const [wantedPage] = await pdfDoc.copyPages(wantedPdfDocument, [numPage - 1]);
  return wantedPage;
}

function setDocumentMetadata(pdfDoc: PDFDocument) {
  // Note that these fields are visible in the "Document Properties" section of
  // most PDF readers.
  pdfDoc.setTitle('Merged document from PDF Finesseur');
  pdfDoc.setAuthor('PDF Finesseur');
  pdfDoc.setSubject('An epic PDF created by PDF Finesseur');
  pdfDoc.setKeywords(['pdf', 'merge']);
  pdfDoc.setProducer('PDF Finesseur');
  pdfDoc.setCreator('pdf-finesseur (https://github.com/jonitoh/pdf-finesseur)');
  pdfDoc.setCreationDate(new Date());
  pdfDoc.setModificationDate(new Date());

  return pdfDoc;
}

// Serialize the PDFDocument to bytes (a Uint8Array)
export default async function createMergedDocumentAsPdfBytes(
  documents: Doc[],
  pages: Page[],
  setMetadata: boolean = true
) {
  // create the merged document
  let mergedPdfDoc = await PDFDocument.create();

  // load our documents
  const pdfDocuments = await loadDocuments(documents);

  // add the pages to the merged document
  for (let index = 0; index < pages.length; index += 1) {
    // extract the wanted page
    // eslint-disable-next-line no-await-in-loop
    const wantedPage = await extractWantedPage(mergedPdfDoc, pdfDocuments, pages[index]);
    mergedPdfDoc.addPage(wantedPage);
  }

  // set metadata
  if (setMetadata) {
    mergedPdfDoc = setDocumentMetadata(mergedPdfDoc);
  }

  // save the merged document
  const pdfBytes = await mergedPdfDoc.save();

  return pdfBytes;
}
