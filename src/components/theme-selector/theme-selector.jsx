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




/*React.useEffect(() => {
  const json = localStorage.getItem("site-dark-mode");
  const currentMode = JSON.parse(json);
  if (currentMode) {
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }
}, []);

React.useEffect(() => {
  if (darkMode) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
  const json = JSON.stringify(darkMode);
  localStorage.setItem("site-dark-mode", json);
}, [darkMode]);
*/

export default ThemeSelector;

ThemeSelector.propTypes = {
}