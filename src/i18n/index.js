const LANGUAGES = {
    ENGLISH: 'en',
    FRENCH: 'fr'
}

export const getValues = () => Object.values(LANGUAGES);

const createMessagesFromLanguages = languages => (
    Object
    .values(languages)
    .map(v => ({ [v]: require(`./messages/${v}.json`) }))
    .reduce((prev, cur) => ({ ...prev, ...cur }), {})
)

export const messages = createMessagesFromLanguages(LANGUAGES);

export const translate = (lang, key, defaultKey = "undefined") => (messages[lang][key in messages[lang] ? key : defaultKey]);

export const getOptionsFromLanguages = languages => (
    Object
    .values(languages)
    .map(v => ({ value: v, label:  translate(v, `${v}-label`)}) )
)

export const filterLanguages = langs => (
    Object
    .entries(LANGUAGES)
    .filter(([, v]) => langs.indexOf(v) !== -1)
    .map(([k, v]) => ({[k]: v}))
    .reduce((prev, cur) => ({ ...prev, ...cur }), {})    
);
