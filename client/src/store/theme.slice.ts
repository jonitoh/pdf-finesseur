/*
State management for theming in the application.
*/
import { StoreFromSlice, OptionForSelector } from '#utils/store';
import THEME from '#theme/themes.json';

export interface ThemeSlice {
  // states
  theme: string;
  themeTagName: string;
  // actions
  getAllThemesAsList(): string[];
  getAllThemesAsOptions(translator: (s: string) => string | undefined): OptionForSelector[];
  updateTheme(theme: unknown): void;
  setDocumentTheme(): void;
  setLocalStorageTheme(): void;
  setTheme(theme: string): void;
  initiateTheme(): void;
}

export default function createThemeSlice<IStore extends ThemeSlice = ThemeSlice>(
  ...[set, get]: Parameters<StoreFromSlice<IStore, ThemeSlice>>
): ReturnType<StoreFromSlice<IStore, ThemeSlice>> {
  return {
    // states
    theme: process.env.THEME || THEME.LIGHT,
    themeTagName: 'data-theme',
    // actions
    getAllThemesAsList: () => Object.values(THEME),
    getAllThemesAsOptions: (translator) =>
      Object.values(THEME).map((v) => ({ value: v, label: translator(`theme:${v}`) })),
    updateTheme: (theme) => (typeof theme === 'string' ? set({ theme }) : null),
    setDocumentTheme: () => document.documentElement.setAttribute(get().themeTagName, get().theme),
    setLocalStorageTheme: () =>
      localStorage.setItem(get().themeTagName, JSON.stringify(get().theme)),
    setTheme: (theme) => {
      get().updateTheme(theme);
      get().setDocumentTheme();
      get().setLocalStorageTheme();
    },
    initiateTheme: () => {
      if (!localStorage.getItem(get().themeTagName)) {
        get().setLocalStorageTheme();
      } else {
        const value = localStorage.getItem(get().themeTagName);
        get().updateTheme(JSON.parse(value || 'null'));
      }
      get().setDocumentTheme();
    },
  };
}
