import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllLanguagesAsOptions } from '#/i18n/utils';
import Selector from '#common/selector/selector';

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    i18n.changeLanguage(event.target.value);
  }

  return (
    <Selector
      defaultOption={{ label: t('settings.chooseLang', { ns: 'page' }), value: i18n.languages[0] }}
      options={getAllLanguagesAsOptions(t)}
      onChange={handleChange}
      unknownLabel={t('undefined')}
    />
  );
}

/*
import logo from './logo.svg';
import './App.css';
import { useTranslation, Trans } from 'react-i18next';

import {useTranslation} from "react-i18next";
import {availableLanguages} from "./i18n";

function App() {
  const {t, i18n} = useTranslation()


const lngs = {
  en: { nativeName: 'English' },
  de: { nativeName: 'Deutsch' }
};

function App() {
  const { t, i18n } = useTranslation();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          {Object.keys(lngs).map((lng) => (
            <button key={lng} style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(lng)}>
              {lngs[lng].nativeName}
            </button>
          ))}
        </div>
        <p>
          <Trans i18nKey="description.part1">
            Edit <code>src/App.js</code> and save to reload.
          </Trans>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('description.part2')}
        </a>
      </header>
    </div>
  );
}

export default App;
*/
