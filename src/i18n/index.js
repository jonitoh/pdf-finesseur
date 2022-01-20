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

export const translate = (lang, key, defaultKey = "undefined", error = 'default') => {
    const isValidKey = key in messages[lang];
    if (isValidKey) {
        return messages[lang][key]
    } else {
        if (error === 'strict') {
            return undefined;
        } else if (error === 'soft') {
            return key;
        } else if (error === 'default') {
            return messages[lang][defaultKey]
        } else {
            throw `error can only have the values 'strict', 'soft' and default'. Instead, the value is '${error}'.`;
        }
    }
};

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
