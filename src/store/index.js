import create from 'zustand'
import mainSlice from './main.slice'
import languageSlice from './language.slice'
import themeSlice from './theme.slice'
import dragAndDropSlice from './drag-and-drop.slice'

export const useStore = create((set, get) => ({
    ...mainSlice(set, get),
    ...languageSlice(set, get),
    ...themeSlice(set, get),
    ...dragAndDropSlice(set, get),//it has to be add after mainSlice
}))