import { EnumLike } from '#utils/main';
import LANGUAGES from './languages.json';

export { LANGUAGES };

export function getValues() {
  return Object.values(LANGUAGES);
}

function createMessagesFromLanguages(languages: EnumLike) {
  return Object.fromEntries(
    // eslint-disable-next-line global-require
    Object.values(languages).map((v) => [v, require(`./messages/${v}.json`) as EnumLike])
  );
}

export const messages = createMessagesFromLanguages(LANGUAGES);

export function translate(
  lang: string,
  key: string,
  defaultKey: string = 'undefined',
  error: string = 'default'
) {
  if (key in messages[lang]) {
    return messages[lang][key];
  }
  if (error === 'strict') {
    return undefined;
  }
  if (error === 'soft') {
    return key;
  }
  if (error === 'default') {
    return messages[lang][defaultKey];
  }
  throw new Error(
    `only values for error are 'strict', 'soft' and default'. Instead, it's '${error}'.`
  );
}

export function getOptionsFromLanguages(languages: EnumLike) {
  return Object.values(languages).map((v) => ({
    value: v,
    label: translate(v, `language-label__${v}`),
  }));
}

export function filterLanguages(langs: string[]) {
  return Object.fromEntries(
    Object.entries(LANGUAGES)
      .filter(([, v]) => langs.indexOf(v) !== -1)
      .map(([k, v]) => [k, v])
  );
}
