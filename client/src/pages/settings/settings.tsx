import React from 'react';
import LanguageSelector from '#components/language-selector/language-selector';
import ThemeSelector from '#components/theme-selector/theme-selector';
import withInnerNavigation from '#pages/wrapper/options';
import styles from './settings.module.css';

function SettingsPage() {
  return (
    <div className={styles.wrapper}>
      <LanguageSelector />
      <br />
      <ThemeSelector />
    </div>
  );
}

export default withInnerNavigation(SettingsPage);
