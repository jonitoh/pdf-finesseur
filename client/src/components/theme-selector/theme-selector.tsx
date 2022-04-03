import React, { ChangeEvent } from 'react';
import select, { Store as State } from '#store';
import Selector from '#common/selector/selector';

const selector = (state: State) => ({
  theme: state.theme,
  getAllThemesAsOptions: state.getAllThemesAsOptions,
  setTheme: state.setTheme,
  t: state.t,
});

export default function ThemeSelector() {
  const { theme, getAllThemesAsOptions, setTheme, t } = select(selector);

  // options
  function softTranslator(key: string) {
    return t(key, 'soft');
  }
  const options = getAllThemesAsOptions(softTranslator);

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setTheme(event.target.value);
  }

  return (
    <Selector
      defaultOption={{ label: softTranslator('choose-theme'), value: theme }}
      options={options}
      onChange={handleChange}
      disabled={!!process.env.DISABLE_THEME}
      unknownLabel={softTranslator('unknown-label')}
    />
  );
}
