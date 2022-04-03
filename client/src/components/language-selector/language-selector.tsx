import React, { ChangeEvent } from 'react';
import select, { Store as State } from '#store';
import Selector from '#common/selector/selector';

const selector = (state: State) => ({
  lang: state.lang,
  getAllLanguagesAsOptions: state.getAllLanguagesAsOptions,
  setLang: state.setLang,
  t: state.t,
});

export default function LanguageSelector() {
  const { lang, setLang, getAllLanguagesAsOptions, t } = select(selector);

  function softTranslator(key: string) {
    return t(key, 'soft');
  }

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setLang(event.target.value);
  }

  return (
    <Selector
      defaultOption={{ label: softTranslator('choose-lang'), value: lang }}
      options={getAllLanguagesAsOptions()}
      onChange={handleChange}
      unknownLabel={softTranslator('unknown-label')}
    />
  );
}
