import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SimpleNavbar from '#components/navbar/simple-navbar/simple-navbar';
import select, { Store as State } from '#store';
import Bin from '#pages/bin/bin';
import Upload from '#pages/upload/upload';
import Settings from '#pages/settings/settings';
import Home from '#pages/home/home';
import Test from '#pages/test/test';
import styles from './app.module.css';

const selector = (state: State) => ({
  initiateTheme: state.initiateTheme,
  initiateLang: state.initiateLang,
});

export default function App() {
  const { initiateTheme, initiateLang } = select(selector);
  // COLOR THEME -- Force an initial state based on the local storage value
  useEffect(() => initiateTheme(), []);
  // LANG THEME -- Force an initial state based on the local storage value
  useEffect(() => initiateLang(), []);
  // CRON JOB TO ERASE ALL

  return (
    <div className={styles.app}>
      <BrowserRouter>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/bin" element={<Bin />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </main>
        <div className={styles.navbar}>
          <SimpleNavbar />
        </div>
      </BrowserRouter>
    </div>
  );
}
