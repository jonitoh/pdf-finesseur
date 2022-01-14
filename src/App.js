import React from 'react';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Placeholder from './components/Placeholder/Placeholder';
import SimpleNavbar from './components/Navbar/SimpleNavbar/SimpleNavbar';
import HomePage from './pages/HomePage/HomePage'


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
              element={<Placeholder>Go upload a file!</Placeholder>}
            />
            <Route
              path="/bin"
              element={<Placeholder>Here are all the deleted pages!</Placeholder>}
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
