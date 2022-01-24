//import { v4 as uuidv4 } from "uuid"; //generate random ids
class Page {
    // initializer
    constructor(id, url, name, parentId, index) {
        this.id = id;
        this.url = url;
        this.parentId = parentId;
        this.name = name;
        this.index = index;
        //this.page = this.getPageLoaded(page);
        //this._parentDoc = parentDoc;
    }

    // TODO fake implementation
    /*getPageLoaded = (page) => {
        return !!page ? page : {}
    }*/

    // 
}

// TODO fake implementation
const generateDocumentId = () => (`File-${(Math.floor(Math.random() * (10000 - 1) + 1))}`)//(uuidv4());
const generatePageId = (parentId, index, separator = "__") => (parentId + separator + index);

class Document {
    // initializer
    constructor(id, name, extension, doc = undefined, path) {
        this.id = id;
        this.extension = extension;
        this.name = name;
        this.doc = this.getDocumentLoaded(doc);
        this.numberOfPages = this.getNumberOfPages();
        this.path = path
        this.url = this.generatePageUrl(0)
    }

    setMapPageToUrl = (mapPageToUrl) => {
        const docUrl = !!mapPageToUrl["-1"] ? mapPageToUrl["-1"]: mapPageToUrl["1"];
        this.___mapPageToUrl = mapPageToUrl;
        // it will override the property url
        this.url = docUrl;
    }

    getUrl = () => {
        if (!!this.url) return this.url;
        return this.___mapPageToUrl[1];
    }
    setUrl = (url) => { this.url = url }
    // TODO fake implementation
    getDocumentLoaded = (doc) => {
        return !!doc ? doc : {}
    }
    // TODO fake implementation
    getNumberOfPages = () => (Math.floor(Math.random() * (4 - 1) + 1))

    // TODO fake implementation
    generatePageUrl = (index) => (generateFakePageUrl(index))

    generatePageName = (index) => (`${this.name} - page ${index}`)

    //
    createPage = (index) => {
        const id = generatePageId(this.id, index);
        const url = this.generatePageUrl(index);
        const name = this.generatePageName(index);

        return new Page(id, url, name, this.id, index)
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
    const path = "/" + name + extension;
    return new Document(id, name, extension, fakeDoc, path)
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
    Document,
    mergePages,
    removePageById,
    removePagesByDocumentId,
    generateFakeDocuments,
    generateFakePages,
}