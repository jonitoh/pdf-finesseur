import React, { ChangeEvent } from 'react';
import select, { Store as State } from '#store';
import Selector from '#common/selector/selector';

const selector = (state: State) => ({
  theme: state.theme,
  getAllThemesAsOptions: state.getAllThemesAsOptions,
  setTheme: state.setTheme,
  softTranslator: state.softTranslator,
});

export default function ThemeSelector() {
  const { theme, getAllThemesAsOptions, setTheme, softTranslator } = select(selector);

  const options = getAllThemesAsOptions(softTranslator);

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setTheme(event.target.value);
  }

  return (
    <Selector
      defaultOption={{ label: softTranslator('settings__choose-theme'), value: theme }}
      options={options}
      onChange={handleChange}
      disabled={process.env.DISABLE_THEME === 'true'}
      unknownLabel={softTranslator('undefined')}
    />
  );
}
