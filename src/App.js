import React from 'react';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SimpleNavbar from './components/Navbar/SimpleNavbar/SimpleNavbar';
import HomePage from './pages/HomePage/HomePage';
import UploadPage from './pages/UploadPage/UploadPage';
import BinPage from './pages/BinPage/BinPage';
import SettingPage from './pages/SettingPage/SettingPage';


const App = () => {

  return (
    <div className="app">
      <BrowserRouter>
        <main className="app__main">
          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/settings"
              element={<SettingPage/>}
            />
            <Route
              path="/add"
              element={<UploadPage/>}
            />
            <Route
              path="/bin"
              element={<BinPage/>}
            />
          </Routes>
        </main>
        <div className='app__nav'>
          <SimpleNavbar />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
