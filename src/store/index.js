import create from 'zustand'
import mainSlice from './mainSlice'

export const useStore = create((set, get) => ({
    ...mainSlice(set, get),
}))