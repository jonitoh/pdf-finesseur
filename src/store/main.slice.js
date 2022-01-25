import {
    mergePages,
    removePageById,
    removePagesByDocumentId,
    generateFakeDocuments,
    generateFakePages,
} from "../services/page-and-document";

// init state
const _documents = generateFakeDocuments(2);
export const _availablePages = generateFakePages(_documents);

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
        availablePages: [...state.availablePages, ...doc.extractPages()],
    })),
    addDocumentFromUploadFile: () => (console.log('addDocumentFromUploadFile')),
    createMergedDocument: (setMetadata = true) => set(state => ({ mergedDocument: mergePages(state.documents, state.availablePages, setMetadata) })),
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