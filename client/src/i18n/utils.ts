import { OptionForSelector } from '#utils/store';

export const debug: boolean = process.env.I18N_DEBUG === 'true';

export const fallbackLng: string = process.env.I18N_FALLBACKLANG || 'fr';

export const lng: string = process.env.I18N_LANG || 'fr';

export const defaultNS: string = process.env.I18N_DEFAULTNS || 'common';

function convertIntoArray(value: unknown) {
  if (typeof value !== 'string') return [];
  return value.split(',');
}

export const availableLanguages: string[] = convertIntoArray(process.env.I18N_LANGS);

export const ns: string[] = convertIntoArray(process.env.I18N_NS);

export function getAllLanguagesAsOptions(
  translator: (s: string) => string | undefined
): OptionForSelector[] {
  return availableLanguages.map((v) => ({
    value: v,
    label: translator(`common:language.${v}`),
  }));
}
