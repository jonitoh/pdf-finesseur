/*
State management for Drag And Drop interaction in the application.
*/
import { StoreFromSlice } from '#utils/store';
import {
  Page,
  removePageById,
  removePagesByDocumentId,
  createMergedDocument,
  safelyCreateDocument,
  Doc,
} from '#services/page-and-document';
import { generateDNDItemFromElement, DNDItem } from '#services/item-and-element';
import { _availablePages } from './main.slice'; // à enlever lorsque ce sera de vrais elements

/* A ENLEVER */
const getItemsFromElements = <T = { id: string }>(elements: T[]) =>
  elements.map((e, i) => generateDNDItemFromElement(e, i));
const _items = getItemsFromElements(_availablePages);
/* A ENLEVER */

type DNDState = {
  selectedItems: DNDItem[];
  lastSelectedIndex: number;
  dragIndex: number;
  hoverIndex: number;
  insertIndex: number;
  isDragging: boolean;
};

type MinimalStore = {
  documents: Doc[];
  availablePages: Page[];
  deletedPages: Page[];
  mergedDocument: Doc | null;
  downloaded: boolean;
};

export interface DragAndDropSlice {
  // states
  listName: string; // 'availablePages'; // keyof MinimalStore;
  items: DNDItem[];
  // dnd states
  dnd: DNDState;
  // dnd actions: the main ones arrangeElementsFromOrder, getItemsFromElements, setItemsFromElements and getElementFromItem
  getElements(): Page[];
  arrangeElementsFromOrder(): void;
  getItemsFromElements(elements: Page[] | undefined): DNDItem[];
  setItemsFromElements(elements: Page[] | undefined): void;
  getElementFromItem(itemId: string): Page | undefined;
  addItemsFromElements(elements: Page[]): void;
  // dnd actions
  updateDNDState(state: Partial<DNDState>): void;
  rearrangeItems(items: DNDItem[]): void;
  clearSelection(): void;
  updateSelection(selectedItems: DNDItem[], lastSelectedIndex: number): void;
  setInsertIndex(dragIndex: number, hoverIndex: number, insertIndex: number): void;
  // rewriting actions from mainSlices
  addAvailablePage(page: Page): void;
  addDocument(doc: unknown): void;
  createMergedDocument(setMetadata: boolean): Promise<void>;
  removePageByIdFromAvailablePages(id: string): void;
  removePagesByDocumentFromAvailablePages(docId: string): void;
  removeDocument(id: string): void;
  resetAll(): void;
}

export default function createDragAndDropSliceSlice<IStore extends DragAndDropSlice & MinimalStore>(
  ...[set, get]: Parameters<StoreFromSlice<IStore, DragAndDropSlice>>
): ReturnType<StoreFromSlice<IStore, DragAndDropSlice>> {
  return {
    // states
    listName: 'availablePages',
    items: _items, // get().getItemsFromElements(),
    // dnd states
    dnd: {
      selectedItems: [],
      lastSelectedIndex: -1,
      dragIndex: -1,
      hoverIndex: -1,
      insertIndex: -1,
      isDragging: false,
    },
    // dnd actions: the main ones arrangeElementsFromOrder, getItemsFromElements, setItemsFromElements and getElementFromItem
    getElements: () => get().availablePages as unknown as Page[],
    arrangeElementsFromOrder: () =>
      set({
        availablePages: get().items.map((item) => get().getElements()[item.order]),
      }),
    getItemsFromElements: (elements: Page[] | undefined) =>
      (elements || get().getElements()).map((e, i) => generateDNDItemFromElement(e, i)),
    setItemsFromElements: (elements: Page[] | undefined) =>
      set({
        items: get().getItemsFromElements(elements),
      }),
    getElementFromItem: (itemId) =>
      get()
        .getElements()
        .find((e) => e.id === itemId),
    addItemsFromElements: (elements: Page[]) =>
      set((state: IStore) => ({
        items: [
          ...state.items,
          ...elements.map((e, i) => generateDNDItemFromElement(e, i + state.items.length)),
        ],
      })),
    // dnd actions
    updateDNDState: (state: Partial<DNDState>) =>
      set((prevState: IStore) => ({ dnd: { ...prevState.dnd, ...state } })),
    rearrangeItems: (items: DNDItem[]) => set({ items }),
    clearSelection: () => get().updateDNDState({ selectedItems: [], lastSelectedIndex: -1 }),
    updateSelection: (selectedItems: DNDItem[], lastSelectedIndex: number) =>
      get().updateDNDState({
        selectedItems,
        lastSelectedIndex,
      }),
    setInsertIndex: (dragIndex: number, hoverIndex: number, insertIndex: number) =>
      get().updateDNDState({
        dragIndex,
        hoverIndex,
        insertIndex,
      }),
    // rewriting actions from mainSlices
    addAvailablePage: (page) => {
      get().arrangeElementsFromOrder();
      get().setItemsFromElements(undefined);
      // add the item
      get().addItemsFromElements([page]);
      // add the available page
      return set((state: IStore) => ({ availablePages: [...state.availablePages, page] }));
    },
    addDocument: (doc: unknown) => {
      const newDoc = safelyCreateDocument(doc);
      newDoc.extractPages().forEach((page) => get().addAvailablePage(page));
      return set((state: IStore) => ({ documents: [...state.documents, newDoc] }));
    },
    removePageByIdFromAvailablePages: (id: string) => {
      get().arrangeElementsFromOrder();
      // remove the page
      const newAvailablePages = removePageById(id, get().availablePages);
      get().setItemsFromElements(newAvailablePages);
      // set the new available pages
      return set({ availablePages: newAvailablePages });
    },
    removePagesByDocumentFromAvailablePages: (docId: string) => {
      get().arrangeElementsFromOrder();
      // remove the pages
      const newAvailablePages = removePagesByDocumentId(docId, get().availablePages);
      get().setItemsFromElements(newAvailablePages);
      // set the new available pages
      return set({ availablePages: newAvailablePages });
    },
    removeDocument: (id: string) => {
      get().removePagesByDocumentFromAvailablePages(id);
      return set((state) => ({ documents: state.documents.filter((doc) => doc.id !== id) }));
    },
    createMergedDocument: async (setMetadata = true) => {
      get().arrangeElementsFromOrder();
      const mergedDocument = await createMergedDocument(
        get().documents,
        get().availablePages,
        setMetadata
      );
      set({ mergedDocument });
    },
    resetAll: () =>
      set({
        ...{
          documents: [],
          availablePages: [],
          deletedPages: [],
          mergedDocument: null,
          downloaded: false,
        },
        ...{
          availablePages: [],
          items: [],
          dnd: {
            selectedItems: [],
            lastSelectedIndex: -1,
            dragIndex: -1,
            hoverIndex: -1,
            insertIndex: -1,
            isDragging: false,
          },
        },
      }),
  };
}
