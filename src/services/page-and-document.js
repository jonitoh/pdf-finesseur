//import { v4 as uuidv4 } from "uuid"; //generate random ids
import { PDFDocument } from 'pdf-lib';
//import {} from '../utils/array.helper';

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
/*
    const addDocumentFromFile = async (docId, docPath, docName) => {
        const [urlMap, numPages] = await extractImagesFromPDF(docPath, docId);
        // addNewDocument
        console.log("========= urlMap", urlMap)
        console.log("========= length urlMap", urlMap.length)
        console.log("========= numPages", numPages)

        const mainPage = urlMap.find(({numPage}) => numPage === 1)
        console.log("========= mainPage", urlMap.find(({numPage}) => numPage === 1))
        // create the document
        const doc = new Document(docId, docName, ".pdf", {}, docPath, "", urlMap);

        const z = doc.urlMap.filter(u => u.numPage == 1);
        console.log("z", z);//[0].url;
        
        doc.numberOfPages = 4;
        console.log(">>>>> doc instance -- add url --- inside async", doc);

        // add the document
        addDocument(doc);
    }
    */
class __Document {
    // initializer (docId, docName, docPath, numPages, urlMap, "");
    constructor(id, name, path, numPages, urlMap, url = "") {
        this.id = id;
        this.name = name;
        this.path = path
        this.numberOfPages = numPages || this.getNumberOfPages();
        this.urlMap = urlMap
        //this.url = url//this.force() || this.generatePageUrl(0)
        this.normalizeUrls(url, urlMap)
        this.url = this.url || this.generatePageUrl(0)

    }
    normalizeUrls = (url, urlMap) => {
        const isValidUrl = !!url;
        const mainUrl = urlMap.find(u => u.numPage === 1)
        if (!isValidUrl & mainUrl) {
            console.log("in there")
            this.url = mainUrl.url
        }
        else {
            this.url = "why"
        }
    }



    setMapPageToUrl = (mapPageToUrl) => {
        const docUrl = !!mapPageToUrl["-1"] ? mapPageToUrl["-1"] : mapPageToUrl["1"];
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
class Document {
    // initializer
    constructor(id, name, extension, doc = undefined, path, url = undefined, urlMap = []) {
        this.id = id;
        this.extension = extension;
        this.name = name;
        this.doc = this.getDocumentLoaded(doc);
        this.numberOfPages = this.getNumberOfPages();
        this.path = path
        this.urlMap = urlMap
        this.url = url || this.generatePageUrl(0)

    }

    force = () => {
        if (this.urlMap.length > 0) {
            const m = this.urlMap[0];
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ m", m)//const [ { url: z}, ..._ ] = [ ...this.urlMap ]//.find(({numPage}) => numPage == 1)
            console.log("biih", this.urlMap)
            console.log("hiiii z is found?", z)
            const { url: z } = m
            if (!!z) {

                return z
            } else {
                return "WHAT 2"
            }
        } else {
            return "WHAT 1"
        }
    }

    setMapPageToUrl = (mapPageToUrl) => {
        const docUrl = !!mapPageToUrl["-1"] ? mapPageToUrl["-1"] : mapPageToUrl["1"];
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

// TODO fake implementation ----> cf. createMergedDocument
const mergePages = async (documents, pages, setMetadata = true) => {
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

///////////////////
// TODO helper
const Retrieve = (array, filterFunction = (value, index, array) => (true), error = 'default', defaultValue = null) => {
    const filteredElements = array.filter(filterFunction);

    if (filteredElements.length > 0) {
        return filteredElements[0]
    } else if (error === 'default') {
        return defaultValue;
    } else {
        throw Error("No wanted element to be found")
    }
}

const loadPDF = async url => {
    const PdfBytes = await fetch(url).then(res => res.arrayBuffer())
    const PdfDoc = await PDFDocument.load(PdfBytes)
    return PdfDoc;
}

const loadDocuments = async documents => (documents.map(doc => ({ [doc.id]: loadPDF(doc.url) })).reduce((prev, cur) => ({ ...prev, ...cur }), {}))

const extractWantedPage = async (pdfDoc, pdfDocuments, pageArgs) => {
    const wantedPdfDocument = pdfDocuments[pageArgs.parentId];
    const [wantedPage] = await pdfDoc.copyPages(wantedPdfDocument, [pageArgs.index]);//, [pageArgs.index - 1])
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

const createMergedDocument = async (documents, pages, setMetadata = true) => {
    // create the merged document
    const mergedPdfDoc = await PDFDocument.create();

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

///////////////////
export {
    __Document,
    Document,
    mergePages,
    removePageById,
    removePagesByDocumentId,
    generateFakeDocuments,
    generateFakePages,
}