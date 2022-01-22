//import { v4 as uuidv4 } from "uuid"; //generate random ids


class Element { // bare minimum so that the dnd interaction can work
    // initializer
    constructor({ id, url }) {
        this.url = url;
        this.id = id;
    }
}
const isInstanceOfElement = (object) => object instanceof Element;

class Page extends Element {
    // initializer
    constructor(id, url, name, parentId, index, page = undefined) {
        super({ id, url })
        this.parentId = parentId;
        this.name = name;
        this.index = index;
        this.page = this.getPageLoaded(page);
        //this._parentDoc = parentDoc;
    }

    // TODO fake implementation
    getPageLoaded = (page) => {
        return !!page ? page : {}
    }

    // 
}

// TODO fake implementation
const generateDocumentId = () => (`File-${(Math.floor(Math.random() * (10000 - 1) + 1))}`)//(uuidv4());
const generatePageId = (parentId, index, separator = "__") => (parentId + separator + index);

class Document extends Element {
    // initializer
    constructor(id, url, name, extension, doc = undefined) {
        super({ id, url })
        this.extension = extension;
        this.name = name;
        this.doc = this.getDocumentLoaded(doc);
        this.numberOfPages = this.getNumberOfPages()
    }

    // TODO fake implementation
    getDocumentLoaded = (doc) => {
        return !!doc ? doc : {}
    }
    // TODO fake implementation
    getNumberOfPages = () => (Math.floor(Math.random() * (4 - 1) + 1))

    // TODO fake implementation
    generatePageObj = () => (undefined)

    // TODO fake implementation
    generatePageUrl = (index) => (generateFakePageUrl(index))

    generatePageName = (index) => (`${this.name} - page ${index}`)

    //
    createPage = (index) => {
        const id = generatePageId(this.id, index);
        const page = this.generatePageObj(index);
        const url = this.generatePageUrl(index);
        const name = this.generatePageName(index);

        return new Page(id, url, name, this.id, index, page)//, this)
    }

    extractPages = () => {
        let pages = [];
        for (let pageNumber = 1; pageNumber <= this.numberOfPages; pageNumber++) {
            pages.push(this.createPage(pageNumber));
        }
        return pages;
    };
}

// TODO fake implementation
const mergePages = pages => {
    const doc = createFakeDocument();
    doc.numberOfPages = pages.length
    return doc
}

// utils
const removePageById = (id, pages) => (pages.filter(page => page.id !== id));
const removePagesByDocumentId = (parentId, pages) => (pages.filter(page => page.parentId !== parentId));


// For testing purpose
const generateFakePageUrl = (i) => ("https://picsum.photos/80/45?random&" + i)

const createFakeDocument = (fakeDoc = undefined) => {
    const id = generateDocumentId();
    const extension = '.pdf';
    const name = `file_${id}`;
    const url = "/" + name + extension;
    return new Document(id, url, name, extension, fakeDoc)
};
const generateFakeDocuments = (number) => {
    let documents = [];
    for (let i = 1; i <= number; i++) {
        documents.push(createFakeDocument());
    }
    return documents;
};
const generateFakePages = (documents) => {
    return (
        documents
            .map(doc => doc.extractPages())
            .reduce((a, b) => (a.concat(b)), [])
    )
};

export {
    Element,
    isInstanceOfElement,
    mergePages,
    removePageById,
    removePagesByDocumentId,
    generateFakeDocuments,
    generateFakePages,
}