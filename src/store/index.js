import create from 'zustand'
import mainSlice from './main-slice'

export const useStore = create((set, get) => ({
    ...mainSlice(set, get),
}))