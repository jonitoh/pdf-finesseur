//import { v4 as uuidv4 } from "uuid"; //generate random ids

const generateDocumentId = () => (`File-${(Math.floor(Math.random() * (10000 - 1) + 1))}`)//(uuidv4());

class Document {
    // initializer
    constructor(path, id, name, extension, doc) {
        this.path = path;
        this.id = id;
        this.extension = extension;
        this.name = name;
        this.doc = doc;
        this.numberOfPages = this.getNumberOfPages()
    }

    // fake number
    getNumberOfPages = () => (Math.floor(Math.random() * (4 - 1) + 1))
}

const createFakeDocument = () => {
    const id = generateDocumentId();
    const extension = '.pdf';
    const doc = {};
    const name = `file_${id}`;
    const path = "/" + name + extension;
    return new Document(path, id, name, extension, doc)
};

const generatePageId = (parentId, index, separator = "__") => (parentId + separator + index);

class Page {
    // initializer
    constructor(path, id, name, page, parentId) {
        this.path = path;
        this.id = id;
        this.parentId = parentId;
        this.name = name;
        this.page = page;
    }
}

const createFakePage = (parentId, pageNumber) => {
    const id = generatePageId(parentId, pageNumber);
    const page = {};
    const name = `page_${pageNumber}_from_${parentId}`;
    const path = "/" + name + ".pdf";
    return new Page(path, id, name, page, parentId)
};

// fake way of doing it
const extractPagesFromDocument = doc => {
    let pages = [];
    for (let pageNumber = 1; pageNumber <= doc.numberOfPages; pageNumber++) {
        pages.push(createFakePage(doc.id, pageNumber));
    }
    return pages;
};

// fake way of doing it
const mergePages = pages => {
    const doc = createFakeDocument();
    doc.numberOfPages = pages.length
    return doc
}

// right way
const removePageById = (id, pages) => (pages.filter(page => page.id !== id));
const removePagesByDocumentId = (parentId, pages) => (pages.filter(page => page.parentId !== parentId));

// FAKE DATA CREATED
const _generateFakeDocuments = (number) => {
    let documents = [];
    for (let i = 1; i <= number; i++) {
        documents.push(createFakeDocument());
    }
    return documents;
};
const _documents = _generateFakeDocuments(2);
const _generateFakePages = (documents) => {
    return (
        documents
        .map(doc => extractPagesFromDocument(doc))
        .reduce((a, b) => (a.concat(b)), [])
    )
};
const _availablePages = _generateFakePages(_documents);

const mainSlice = (set, get) => ({
    //states
    documents: _documents,//[],
    availablePages: _availablePages,//[],
    deletedPages: [],
    mergedDocument: null,
    downloaded: false,
    //actions
    getNumberOfDocuments: () => (get().documents.length),
    getNumberOfAvailablePages: () => (get().availablePages.length),
    getNumberOfDeletedPages: () => (get().deletedPages.length),
    getAvailablePages: () => (get().availablePages),
    getMergedDocument: () => (get().mergedDocument),
    addAvailablePage: page => set(state => ({ availablePages: [...state.availablePages, page] })),
    addDeletedPage: page => set(state => ({ deletedPages: [...state.deletedPages, page] })),
    addDocument: doc => set(state => ({
        documents: [...state.documents, doc],
        availablePages: [...state.availablePages, ...extractPagesFromDocument(doc)],
    })),
    createMergedDocument: () => set(state => ({ mergedDocument: mergePages(state.availablePages) })),
    removePageByIdFromAvailablePages: id => set(state => ({ availablePages: removePageById(id, state.availablePages) })),
    removePagesByDocumentFromAvailablePages: parentId => set(state => ({ availablePages: removePagesByDocumentId(parentId, state.availablePages) })),
    removePageByIdFromDeletedPages: id => set(state => ({ deletedPages: removePageById(id, state.deletedPages) })),
    removePagesByDocumentFromDeletedPages: parentId => set(state => ({ deletedPages: removePagesByDocumentId(parentId, state.deletedPages) })),
    removeDocument: id => set(state => ({ documents: state.documents.filter(doc => doc.id !== id )})),
    resetAll: () => set({
        documents: [],
        availablePages: [],
        deletedPages: [],
        mergedDocument: null,
        downloaded: false,
    }),
})

export default mainSlice