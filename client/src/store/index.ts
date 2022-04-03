/*
Global state management in the application.
*/
import create, { StateSelector } from 'zustand';
import shallow from 'zustand/shallow';
import createMainSlice, { MainSlice } from './main.slice';
import createLanguageSlice, { LanguageSlice } from './language.slice';
import createThemeSlice, { ThemeSlice } from './theme.slice';
import createDragAndDropSlice, { DragAndDropSlice } from './drag-and-drop.slice';

export interface Store extends MainSlice, LanguageSlice, ThemeSlice, DragAndDropSlice {}

export const useStore = create<Store>((set, get, api) => ({
  ...createMainSlice(set, get, api),
  ...createLanguageSlice(set, get, api),
  ...createThemeSlice(set, get, api),
  ...createDragAndDropSlice(set, get, api), // it has to be add after mainSlice
}));

export default function select<U>(selector: StateSelector<Store, U>): U {
  return useStore(selector, shallow);
}
