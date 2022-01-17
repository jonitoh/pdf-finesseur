import React from 'react';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Placeholder from './components/Placeholder/Placeholder';
import SimpleNavbar from './components/Navbar/SimpleNavbar/SimpleNavbar';
import HomePage from './components/HomePage/HomePage'
import UploadPage from './components/UploadPage/UploadPage';
import BinPage from './components/BinPage/BinPage';


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
              element={<Placeholder>Here are your settings!</Placeholder>}
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
