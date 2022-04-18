/*
State management for translation in the application.
*/
import { StoreFromSlice, OptionForSelector } from '#utils/store';
import { LANGUAGES, translate, getValues, getOptionsFromLanguages, filterLanguages } from '#i18n';

export interface LanguageSlice {
  // states
  lang: string;
  langs: string[];
  langTagName: string;
  // actions
  removeLang(lang: string): void;
  getLangs(): string[];
  getLang(): string;
  updateLang(lang: unknown): void;
  setDocumentLang(): void;
  setLocalStorageLang(): void;
  setLang(lang: string): void;
  initiateLang(): void;
  t(key: string, error: string): string | undefined;
  softTranslator(key: string): string;
  getAllLanguagesAsOptions(): OptionForSelector[];
}

export default function createLanguageSlice<IStore extends LanguageSlice = LanguageSlice>(
  ...[set, get]: Parameters<StoreFromSlice<IStore, LanguageSlice>>
): ReturnType<StoreFromSlice<IStore, LanguageSlice>> {
  return {
    // states
    lang: process.env.LANG || LANGUAGES.FRENCH,
    langs: getValues(),
    langTagName: 'data-lang',
    // actions
    removeLang: (lang) =>
      set((state: IStore) => ({ langs: state.langs.filter((language) => language !== lang) })),
    getLangs: () => get().langs,
    getLang: () => get().lang,
    updateLang: (lang) => (typeof lang === 'string' ? set({ lang }) : null), // avoir un update laxiste ?
    setDocumentLang: () => document.documentElement.setAttribute('lang', get().lang),
    setLocalStorageLang: () => localStorage.setItem(get().langTagName, JSON.stringify(get().lang)),
    setLang: (lang) => {
      get().updateLang(lang);
      get().setDocumentLang();
      get().setLocalStorageLang();
    },
    initiateLang: () => {
      if (!localStorage.getItem(get().langTagName)) {
        get().setLocalStorageLang();
      } else {
        const value = localStorage.getItem(get().langTagName);
        get().updateLang(JSON.parse(value || 'null'));
      }
      get().setDocumentLang();
    },
    t: (key, error = 'default') => translate(get().lang, key, 'undefined', error),
    softTranslator: (key) => translate(get().lang, key, 'undefined', 'soft') as string,
    getAllLanguagesAsOptions: () => getOptionsFromLanguages(filterLanguages(get().langs)),
  };
}
