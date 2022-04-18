import React, { ChangeEvent } from 'react';
import select, { Store as State } from '#store';
import Selector from '#common/selector/selector';

const selector = (state: State) => ({
  lang: state.lang,
  getAllLanguagesAsOptions: state.getAllLanguagesAsOptions,
  setLang: state.setLang,
  softTranslator: state.softTranslator,
});

export default function LanguageSelector() {
  const { lang, setLang, getAllLanguagesAsOptions, softTranslator } = select(selector);

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setLang(event.target.value);
  }

  return (
    <Selector
      defaultOption={{ label: softTranslator('settings__choose-lang'), value: lang }}
      options={getAllLanguagesAsOptions()}
      onChange={handleChange}
      unknownLabel={softTranslator('undefined')}
    />
  );
}
