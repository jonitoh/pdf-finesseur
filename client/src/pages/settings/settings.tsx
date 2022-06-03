import React from 'react';
import LanguageSelector from '#components/language-selector/language-selector';
import ThemeSelector from '#components/theme-selector/theme-selector';
import withInnerNavigation from '#pages/wrapper/options';
import PurgeButton from '#components/purge-button/purge-button';
import styles from './settings.module.css';

function SettingsPage() {
  return (
    <div className={styles.wrapper}>
      <LanguageSelector />
      <br />
      <ThemeSelector />
      <br />
      <PurgeButton />
    </div>
  );
}

export default withInnerNavigation(SettingsPage);
