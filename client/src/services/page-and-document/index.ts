/*
Page and Document are respectively the classes representing a File and a page of its file.
For now, Document can only be PDFs. In the future, images could be imported.
*/
import { generateWeakId as generateId } from '#utils/main';
// import { generateStrongId as generateId } from '#utils/main';
import createMergedDocumentAsPdfBytes from '#services/pdf-lib';
import Page from './page';
import Doc, { ConstructorProps as DocConstructorProps } from './document';

// --- UTILS
function safelyCreateDocument(element: unknown) {
  if (element instanceof Doc) {
    return element;
  }
  const document = new Doc({ ...(element as DocConstructorProps) });
  console.info('New document created', document);
  return document;
}

function removePageById(id: string, pages: Page[]) {
  return pages.filter((page) => page.id !== id);
}

function removePagesByDocumentId(docId: string, pages: Page[]) {
  return pages.filter((page) => page.docId !== docId);
}

function generatePagesFromDocuments(documents: Doc[]) {
  return documents.map((doc) => doc.extractPages()).reduce((a, b) => a.concat(b), []);
}

async function createMergedDocument(documents: Doc[], pages: Page[], setMetadata: boolean = true) {
  const pdfBytes = await createMergedDocumentAsPdfBytes(documents, pages, setMetadata);
  const mergedDocument = new Doc({
    id: 'merged-document',
    name: 'merged-document.pdf',
    path: '',
    numPages: pages.length,
    urlMap: [],
    url: '',
    extension: '.pdf',
  });
  // add our pdfBytes
  mergedDocument.setData(pdfBytes);

  return mergedDocument;
}

// --- FOR TESTING PURPOSE
function getFakePhotoUrl(i: number) {
  return `https://picsum.photos/seed/pdffinesseur/100?random&${i}`;
}

function createFakeDocument(numPages: number) {
  const id = generateId(1, 2000);
  const urlMap = [];
  for (let numPage = 1; numPage <= numPages; numPage += 1) {
    urlMap.push({ numPage, url: getFakePhotoUrl(numPage) });
  }

  return new Doc({
    id,
    name: `file_${id}`,
    path: `/file_${id}.pdf`,
    numPages,
    urlMap,
    url: getFakePhotoUrl(0),
  });
}

async function createFakeMergedDocument(
  documents: Doc[],
  pages: Page[],
  setMetadata: boolean = true
) {
  return new Promise<Doc>(function executor(resolve) {
    setTimeout(function callback() {
      resolve(createFakeDocument(pages.length));
    }, 2000);
  });
}

function generateFakeDocuments(number: number) {
  const documents = [];
  for (let i = 1; i <= number; i += 1) {
    const numPages = Math.floor(Math.random() * 4 + 1);
    documents.push(createFakeDocument(numPages));
  }
  return documents;
}

function generateFakeDocumentsAndFakePages(number: number): [Doc[], Page[]] {
  const documents = generateFakeDocuments(number);
  const pages = generatePagesFromDocuments(documents);
  return [documents, pages];
}

export {
  Page,
  Doc,
  safelyCreateDocument,
  createMergedDocument,
  createFakeMergedDocument,
  removePageById,
  removePagesByDocumentId,
  generateFakeDocumentsAndFakePages,
};
