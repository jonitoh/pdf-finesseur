import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import SimpleNavbar from './components/Navbar/SimpleNavbar/SimpleNavbar';

const App = () => {


  return (
    <div className="app">
      <BrowserRouter>
        <main className="app__main">
          <Routes>
            <Route
              path="/"
              element={<Home placeholder={"Main space!"} />}
            />
            <Route
              path="/settings"
              element={<Home placeholder={"Here are your settings!"} />}
            />
            <Route
              path="/add"
              element={<Home placeholder={"Go upload a file!"} />}
            />
            <Route
              path="/bin"
              element={<Home placeholder={"Here are all the deleted pages!"} />}
            />
          </Routes>

        </main>
        <div className="app__nav">
          <SimpleNavbar />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
