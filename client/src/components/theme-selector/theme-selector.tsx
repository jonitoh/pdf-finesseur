import React, { ChangeEvent } from 'react';
import select, { Store as State } from '#store';
import { useTranslation } from 'react-i18next';
import Selector from '#common/selector/selector';

const selector = (state: State) => ({
  theme: state.theme,
  getAllThemesAsOptions: state.getAllThemesAsOptions,
  setTheme: state.setTheme,
});

export default function ThemeSelector() {
  const { theme, getAllThemesAsOptions, setTheme } = select(selector);
  const { t } = useTranslation();

  const options = getAllThemesAsOptions(t);

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setTheme(event.target.value);
  }

  return (
    <Selector
      defaultOption={{ label: t('settings.chooseTheme', { ns: 'page' }), value: theme }}
      options={options}
      onChange={handleChange}
      disabled={process.env.DISABLE_THEME === 'true'}
      unknownLabel={t('undefined')}
    />
  );
}
