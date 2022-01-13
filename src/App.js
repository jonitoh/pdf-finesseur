import React from 'react';
import './App.css';
import Home from './components/Home/Home';

const App = () => {


  return (
    <div className="app">
      <main className="app__main">
        <Home placeholder={"This is a placeholder!"} />
      </main>
      
      <navbar className="app__nav navbar-simple">
        <ul className="navbar__list">
          <li className="navbar__item">
            <a href="#">
              <img src="ressources/images/icons/actions-add-file-desktop-jld6gct-svgrepo-com.svg" />
              <p className="navbar__itemlabel">Ajouter fichier</p>
            </a>
          </li>
          <li className="navbar__item">
            <a href="#">
              <div className="notification-wrapper">
                <img src="ressources/images/icons/trash-bin-svgrepo-com.svg" />
                <div className="notification-indicator">
                  <div className="notification-count" role="status">
                    5
                  </div>
                </div>
              </div>
              <p className="navbar__itemlabel">Poubelle</p>
            </a>
          </li>
          <li className="navbar__item">
            <a href="#">
              <img src="ressources/images/icons/settings-svgrepo-com.svg" />
              <p className="navbar__itemlabel">Paramètres</p>
            </a>
          </li>
          <li className="navbar__item">
            <a href="#">
              <img src="ressources/images/icons/button-circle-round-arrow-down-svgrepo-com.svg" />
              <p className="navbar__itemlabel">Télécharger</p>
            </a>
          </li>
        </ul>
      </navbar>
    </div>
  );
}

export default App;
