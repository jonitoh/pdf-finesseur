import React, { useEffect } from 'react';
import './app.scoped.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@pages/home-page/home-page';
import UploadPage from '@pages/upload-page/upload-page';
import BinPage from '@pages/bin-page/bin-page';
import SettingsPage from '@pages/settings-page/settings-page';
import SimpleNavbar from '@components/navbar/simple-navbar/simple-navbar';
import { useStore } from '@store';



const App = () => {

  const { initiateTheme, initiateLang } = useStore();
  // COLOR THEME -- Force an initial state based on the local storage value
  useEffect(() => initiateTheme(), []);
  // LANG THEME -- Force an initial state based on the local storage value
  useEffect(() => initiateLang(), []);
  // CRON JOB TO ERASE ALL
  console.log("test env variable", process.env);

  return (
    <div className="app">
      <BrowserRouter>
        <main className="main">
          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/settings"
              element={<SettingsPage />}
            />
            <Route
              path="/upload"
              element={<UploadPage />}
            />
            <Route
              path="/bin"
              element={<BinPage />}
            />
          </Routes>
        </main>
        <div className='navbar'>
          <SimpleNavbar />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
