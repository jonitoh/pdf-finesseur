/*
Page and Document are respectively the classes representing a File and a page of its file.
For now, Document can only be PDFs. In the future, images could be imported.
*/
import { generateWeakId as generateId } from '../utils/functions';
import { createMergedDocumentAsPdfBytes } from '../services/pdf-lib';

// --- CLASSES
class Page {
    // initializer
    constructor({ id = "", name = "", docId, numPage, url, generateName = undefined }) {
        this.docId = docId;
        this.numPage = numPage;
        this.url = url;
        this.generateName = generateName || this.__generateName;
        this.id = id || this.generateId();
        this.name = name || this.generateName(this);
    }

    generateId = (separator = "__") => (this.docId + separator + this.numPage);

    __generateName = (page) => (`${page.docId} - page ${page.numPage}`);

    // not sure it's worth it -- it should be a data url
    setData = (data) => {
        this._data = data;
    }
}

class Document {
    // initializer
    constructor({ id, name, path, numPages, urlMap, url = "", extension = ".pdf" }) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.numPages = numPages;
        this.urlMap = urlMap; // list of objects { numPage, url }
        this.url = url || this.getPageUrl(-1) || this.getPageUrl(1)
    }

    __generatePageName = (num) => (() => (`${this.name} - page ${num}`));

    getPageUrl = (num) => {
        const found = this.urlMap.find(({ numPage }) => numPage === num);
        return !!found ? found.url : ""
    }
    // not sure it's worth it -- it should be a data url
    setData = (data) => {
        this._data = data;
    }

    getData = () => (this._data);

    //
    extractPage = (numPage) => {
        if (numPage > this.numPages) {
            throw new Error(`You try to extract the non-existent page ${numPage} from the ${this.numPages} available pages.`)
        }
        return new Page({
            docId: this.id,
            numPage: numPage,
            url: this.getPageUrl(numPage),
            generateName: this.__generatePageName(numPage)
        })
    }

    extractPages = () => {
        let pages = [];
        for (let numPage = 1; numPage <= this.numPages; numPage++) {
            pages.push(this.extractPage(numPage));
        }
        return pages;
    }
}

// --- UTILS
const safelyCreateDocument = (element) => {
    if (element instanceof Document) {
        return element
    }
    try {
        const document = new Document({ ...element});
        console.log("New document created", document);
        return document
    } catch (error) {
        throw new Error(error)
    }
}

const removePageById = (id, pages) => (pages.filter(page => page.id !== id));

const removePagesByDocumentId = (docId, pages) => (pages.filter(page => page.docId !== docId));

const generatePagesFromDocuments = (documents) => {
    return (
        documents
            .map(doc => doc.extractPages())
            .reduce((a, b) => (a.concat(b)), [])
    )
};

const createMergedDocument = async (documents, pages, setMetadata = true) => {
    const pdfBytes = await createMergedDocumentAsPdfBytes(documents, pages, setMetadata);
    const mergedDocument = new Document({
        id: "merged-document",
        name: "merged-document.pdf",
        path: "",
        numPages: pages.length,
        urlMap: [],
        url: "",
        extension: ".pdf"
    });
    mergedDocument.setData(pdfBytes);
    return mergedDocument;
}

const createFakeMergedDocument = async (documents, pages, setMetadata = true) => {
    return createFakeDocument(pages.length);
}

// --- FOR TESTING PURPOSE
const getFakePhotoUrl = (i) => ("https://picsum.photos/seed/pdffinesseur/100?random&" + i)

const createFakeDocument = (numPages) => {
    const id = generateId(1, 2000);
    const urlMap = [];
    for (let numPage = 1; numPage <= numPages; numPage++) {
        urlMap.push({numPage: numPage, url: getFakePhotoUrl(numPage)});
    };

    return new Document({
        id: id,
        name: `file_${id}`,
        path: `/file_${id}.pdf`,
        numPages: numPages,
        urlMap: urlMap,
        url: getFakePhotoUrl(0)
    })
};

const generateFakeDocuments = (number) => {
    let documents = [];
    for (let i = 1; i <= number; i++) {
        const numPages = (Math.floor(Math.random() * 4 + 1));
        documents.push(createFakeDocument(numPages));
    }
    return documents;
};

const generateFakeDocumentsAndFakePages = (number) => {
    const documents = generateFakeDocuments(number);
    const pages = generatePagesFromDocuments(documents);
    return [documents, pages]
}


export {
    Page,
    Document,
    safelyCreateDocument,
    createMergedDocument,
    createFakeMergedDocument,
    removePageById,
    removePagesByDocumentId,
    generateFakeDocumentsAndFakePages,
}