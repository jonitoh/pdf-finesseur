/*
State management for Page and Document in the application.
*/
import { StoreFromSlice } from '#utils/store';
import {
  Doc,
  Page,
  safelyCreateDocument,
  createMergedDocument,
  removePageById,
  removePagesByDocumentId,
  generateFakeDocumentsAndFakePages,
} from '#services/page-and-document';

// init state -- export only for the beginning
const [_documents, _availablePages] = generateFakeDocumentsAndFakePages(2);

export { _documents, _availablePages };

export interface MainSlice {
  // states
  documents: Doc[];
  availablePages: Page[];
  deletedPages: Page[];
  mergedDocument: Doc | null;
  downloaded: boolean;
  // actions
  getNumberOfDocuments(): number;
  getNumberOfAvailablePages(): number;
  getNumberOfDeletedPages(): number;
  getAvailablePages(): Page[];
  getMergedDocument(): Doc | null;
  addAvailablePage(page: Page): void;
  addDeletedPage(page: Page): void;
  addDeletedPageByIdFromAvailablePages(id: string, mustRemovePage?: boolean): void;
  addAvailablePageByIdFromDeletedPages(id: string, mustRemovePage?: boolean): void;
  addDocument(doc: unknown): void;
  createMergedDocument(setMetadata: boolean): Promise<void>;
  removePageByIdFromAvailablePages(id: string): void;
  removePagesByDocumentFromAvailablePages(docId: string): void;
  removePageByIdFromDeletedPages(id: string): void;
  removePagesByDocumentFromDeletedPages(docId: string): void;
  removeDocument(id: string): void;
  resetAll(): void;
}

export default function createMainSlice<IStore extends MainSlice = MainSlice>(
  ...[set, get]: Parameters<StoreFromSlice<IStore, MainSlice>>
): ReturnType<StoreFromSlice<IStore, MainSlice>> {
  return {
    // states
    documents: _documents, // [],
    availablePages: _availablePages, // [],
    deletedPages: [],
    mergedDocument: null,
    downloaded: false,
    // actions
    getNumberOfDocuments: () => get().documents.length,
    getNumberOfAvailablePages: () => get().availablePages.length,
    getNumberOfDeletedPages: () => get().deletedPages.length,
    getAvailablePages: () => get().availablePages,
    getMergedDocument: () => get().mergedDocument,
    addAvailablePage: (page) =>
      set((state) => ({ availablePages: [...state.availablePages, page] })),
    addDeletedPage: (page) => set((state) => ({ deletedPages: [...state.deletedPages, page] })),
    addDeletedPageByIdFromAvailablePages: (id, mustRemovePage = true) => {
      const toBeDeletedPage = get().availablePages.find((page) => page.id === id);
      if (!toBeDeletedPage) {
        throw new Error("We couldn't find the page");
      }
      get().addDeletedPage(toBeDeletedPage);
      if (mustRemovePage) {
        get().removePageByIdFromAvailablePages(id);
      }
    },
    addAvailablePageByIdFromDeletedPages: (id, mustRemovePage = true) => {
      const toBeAvailablePage = get().deletedPages.find((page) => page.id === id);
      if (!toBeAvailablePage) {
        throw new Error("We couldn't find the page");
      }
      get().addAvailablePage(toBeAvailablePage);
      if (mustRemovePage) {
        get().removePageByIdFromDeletedPages(id);
      }
    },
    addDocument: (doc) => {
      const newDoc = safelyCreateDocument(doc);
      return set((state) => ({
        documents: [...state.documents, newDoc],
        availablePages: [...state.availablePages, ...newDoc.extractPages()],
      }));
    },
    createMergedDocument: async (setMetadata = true) => {
      const mergedDocument = await createMergedDocument(
        get().documents,
        get().availablePages,
        setMetadata
      );
      set({ mergedDocument });
    },
    removePageByIdFromAvailablePages: (id) =>
      set((state: IStore) => ({ availablePages: removePageById(id, state.availablePages) })),
    removePagesByDocumentFromAvailablePages: (docId) =>
      set((state: IStore) => ({
        availablePages: removePagesByDocumentId(docId, state.availablePages),
      })),
    removePageByIdFromDeletedPages: (id) =>
      set((state: IStore) => ({ deletedPages: removePageById(id, state.deletedPages) })),
    removePagesByDocumentFromDeletedPages: (docId) =>
      set((state: IStore) => ({
        deletedPages: removePagesByDocumentId(docId, state.deletedPages),
      })),
    removeDocument: (id) =>
      set((state: IStore) => ({ documents: state.documents.filter((doc) => doc.id !== id) })),
    resetAll: () =>
      set({
        documents: [],
        availablePages: [],
        deletedPages: [],
        mergedDocument: null,
        downloaded: false,
      }),
  };
}
