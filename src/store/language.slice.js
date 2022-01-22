import { translate, getValues, getOptionsFromLanguages, filterLanguages } from '../i18n'


const languageSlice = (set, get) => ({
    //states
    lang: 'fr',
    defaultLang: 'fr',
    langs: getValues(),
    //actions
    removeLang: lang => set(state => ({ langs: state.langs.filter(language => language !== lang)})),
    getLangs: () => (get().langs),
    getLang: () => (get().lang),
    setLang: lang => set({lang: lang}),
    t: (key, error = 'default') => (translate(get().lang, key, "undefined", error)),
    getOptions: () => (getOptionsFromLanguages(filterLanguages(get().langs))),
})

export default languageSlice
