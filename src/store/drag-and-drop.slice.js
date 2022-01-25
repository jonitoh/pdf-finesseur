import { generateDNDItemFromElement } from '../services/item-and-element';
import { removePageById, removePagesByDocumentId, mergePages } from "../services/page-and-document";
import { _availablePages } from "./main.slice" // à enlever lorsque ce sera de vrais elements


const getItemsFromElements = (elements) => (
    elements
        .map((e, i) => generateDNDItemFromElement(e, i))
);
const _items = getItemsFromElements(_availablePages);

const listName = "availablePages";
const dragAndDropSlice = (set, get) => ({
    //states
    getElements: () => get()[listName],
    items: _items,//get().getItemsFromElements(),
    // dnd states
    dnd: {
        selectedItems: [],
        lastSelectedIndex: -1,
        dragIndex: -1,
        hoverIndex: -1,
        insertIndex: -1,
        isDragging: false
    },
    // actions: the main ones arrangeElementsFromOrder, getItemsFromElements, setItemsFromElements and getElementFromItem
    arrangeElementsFromOrder: () => set({
        [listName]: (
            get()
                .items
                .map(item => get().getElements()[item.order])
        )
    }),
    getItemsFromElements: (elements = false) => (
        (!!elements ? elements : get().getElements())
            .map((e, i) => generateDNDItemFromElement(e, i))
    ),
    setItemsFromElements: (elements = false) => set({
        items: get().getItemsFromElements(elements)
    }),
    getElementFromItem: (itemId) => (get().getElements().filter(e => e.id === itemId)[0]),
    addItemsFromElements: (elements) => set(state => ({
        items: [
            ...state.items,
            ...elements.map((e, i) => generateDNDItemFromElement(e, i + state.items.length))
        ]
    })),
    // dnd actions
    rearrangeItems: (items) => set({ items: items }),
    updateDNDState: (state) => set(prevState => ({ dnd: { ...prevState.dnd, ...state } })),
    // --> useless ?
    clearSelection: () => get().updateDNDState({ selectedItems: [], lastSelectedIndex: -1 }),
    // --> useless ?
    updateSelection: (selectedItems, lastSelectedIndex) => get().updateDNDState({
        selectedItems: selectedItems,
        lastSelectedIndex: lastSelectedIndex
    }),
    // --> useless ?
    setInsertIndex: (dragIndex, hoverIndex, insertIndex) => get().updateDNDState({
        dragIndex: dragIndex,
        hoverIndex: hoverIndex,
        insertIndex: insertIndex
    }),
    // rewriting actions from mainSlices
    addAvailablePage: page => {
        console.log("---------page", page)
        console.log("---------elements", get().getElements())
        console.log("---------items", get().items)
        get().arrangeElementsFromOrder();
        console.log("---------ARRANGED elements", get().getElements())
        get().setItemsFromElements();
        console.log("---------new items", get().items)
        // add the item
        get().addItemsFromElements([page]);
        console.log("---------new new items", get().items)
        // add the available page
        return set(state => ({ availablePages: [...state.availablePages, page] }))
    },
    addDocument: doc => {
        doc
            .extractPages()
            .forEach(page => get().addAvailablePage(page));

        return set(state => ({ documents: [...state.documents, doc] }))
    },
    removePageByIdFromAvailablePages: id => {
        console.log("@@@elements", get().getElements());
        console.log("@@@order", get().items);
        get().arrangeElementsFromOrder();
        // remove the page
        const newAvailablePages = removePageById(id, get().availablePages);
        get().setItemsFromElements(newAvailablePages);
        // set the new available pages
        return set({ availablePages: newAvailablePages });
    },
    removePagesByDocumentFromAvailablePages: parentId => {
        get().arrangeElementsFromOrder();
        // remove the pages
        const newAvailablePages = removePagesByDocumentId(parentId, get().availablePages);
        get().setItemsFromElements(newAvailablePages);
        // set the new available pages
        return set({ availablePages: newAvailablePages });
    },
    removeDocument: id => {
        get().removePagesByDocumentFromAvailablePages(id);
        return set(state => ({ documents: state.documents.filter(doc => doc.id !== id) }))
    },
    createMergedDocument: (setMetadata = true) => {
        get().arrangeElementsFromOrder();
        return set(state => ({ mergedDocument: mergePages(state.documents, state.availablePages, setMetadata) }))
    },
    resetAll: () => set({
        ...{
            documents: [],
            availablePages: [],
            deletedPages: [],
            mergedDocument: null,
            downloaded: false,
        },
        ...{
            [listName]: [],
            items: [],
            dnd: {
                selectedItems: [],
                lastSelectedIndex: -1,
                dragIndex: -1,
                hoverIndex: -1,
                insertIndex: -1,
                isDragging: false
            },
        }
    }),
})

export default dragAndDropSlice