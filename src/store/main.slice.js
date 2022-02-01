/*
State management for Page and Document in the application.
*/
import {
    safelyCreateDocument,
    createMergedDocument,
    removePageById,
    removePagesByDocumentId,
    generateFakeDocumentsAndFakePages,
} from "../services/page-and-document";


// init state -- export only for the beginning
const [_documents, _availablePages] = generateFakeDocumentsAndFakePages(2);

export {
    _documents,
    _availablePages
}

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
    addDocument: doc => {
        doc = safelyCreateDocument(doc);
        return set(state => ({
            documents: [...state.documents, doc],
            availablePages: [...state.availablePages, ...doc.extractPages()],
        }))
    },
    createMergedDocument: async (setMetadata = true) => set(state => ({ mergedDocument: createMergedDocument(state.documents, state.availablePages, setMetadata) })),
    removePageByIdFromAvailablePages: id => set(state => ({ availablePages: removePageById(id, state.availablePages) })),
    removePagesByDocumentFromAvailablePages: docId => set(state => ({ availablePages: removePagesByDocumentId(docId, state.availablePages) })),
    removePageByIdFromDeletedPages: id => set(state => ({ deletedPages: removePageById(id, state.deletedPages) })),
    removePagesByDocumentFromDeletedPages: docId => set(state => ({ deletedPages: removePagesByDocumentId(docId, state.deletedPages) })),
    removeDocument: id => set(state => ({ documents: state.documents.filter(doc => doc.id !== id) })),
    resetAll: () => set({
        documents: [],
        availablePages: [],
        deletedPages: [],
        mergedDocument: null,
        downloaded: false,
    }),
})

export default mainSlice