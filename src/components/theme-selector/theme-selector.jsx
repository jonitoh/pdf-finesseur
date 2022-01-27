import React from 'react';
import './theme-selector.css';
import { useStore } from '../../store';
import Selector from '../selector/selector';

const ThemeSelector = () => {
  const {
    theme,
    getAllThemesAsOptions,
    setTheme,
    t,
  } = useStore();

  // options
  const softTranslator = key => t(key, 'soft');
  const options = getAllThemesAsOptions(softTranslator);
  // 
  const handleChange = event => {
    setTheme(event.target.value);
  };

  return (
    <Selector
      label={t("choose-theme")}
      value={theme}
      options={options}
      onChange={handleChange}
      disabled={process.env.DISABLE_THEME ? true : null}
    />
  )
};

export default ThemeSelector;

ThemeSelector.propTypes = {
}