import create from 'zustand'
import mainSlice from './main-slice'
import languageSlice from './language-slice'

export const useStore = create((set, get) => ({
    ...mainSlice(set, get),
    ...languageSlice(set, get),
}))