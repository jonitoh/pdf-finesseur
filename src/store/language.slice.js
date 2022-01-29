/*
State management for translation in the application.
*/
import { LANGUAGES } from "@utils/constants";
import { translate, getValues, getOptionsFromLanguages, filterLanguages } from '../i18n'


const languageSlice = (set, get) => ({
    //states
    lang: process.env.LANG || LANGUAGES.FRENCH,
    langs: getValues(),
    langTagName: "data-lang",
    //actions
    removeLang: lang => set(state => ({ langs: state.langs.filter(language => language !== lang)})),
    getLangs: () => (get().langs),
    getLang: () => (get().lang),
    updateLang: lang => set({ lang: lang }),
    setDocumentLang: () => document.documentElement.setAttribute("lang", get().lang),
    setLocalStorageLang: () => (localStorage.setItem(get().langTagName, JSON.stringify(get().lang))),
    setLang: lang => {
        get().updateLang(lang);
        get().setDocumentLang();
        get().setLocalStorageLang();
    },
    initiateLang: () => {
        if (!localStorage.getItem(get().langTagName)) {
            get().setLocalStorageLang(get().lang);
        } else {
            get().updateLang(JSON.parse(localStorage.getItem(get().langTagName)))
        }
        get().setDocumentLang()
    },
    t: (key, error = 'default') => (translate(get().lang, key, "undefined", error)),
    getAllLanguagesAsOptions: () => (getOptionsFromLanguages(filterLanguages(get().langs))),
})

export default languageSlice