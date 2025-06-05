import './assets/css/General.css';
import './assets/css/Registration.css';
import './assets/css/CardGame.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { routes as mainRoutes, defaultRoutes } from './Routes';
import React, { useEffect } from 'react';
import StarBackground from './components/Background/StarBackground.js';
import { connect } from 'react-redux';
import { incrementCounter } from './actions/counter.actions.js';

function App({ incrementCounter }) {
  useEffect(() => {
    const clickHandler = e => {
      if (e.target.localName === 'a' || e.target.localName === 'button') {
        incrementCounter(1);
      }
    };

    document.addEventListener('click', clickHandler);

    return () => {
      document.removeEventListener('click', clickHandler);
    };
  }, [incrementCounter]);

  return (
    <Router>
      <div className="main-container bg-black min-h-screen text-white">
        <nav className="p-4 flex flex-wrap justify-center gap-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
          <Link className="hover:text-yellow-300" to={defaultRoutes.HOME}>Home</Link>
          <Link className="hover:text-yellow-300" to={defaultRoutes.GAME}>Game</Link>
          <Link className="hover:text-yellow-300" to={defaultRoutes.LOGIN}>Login</Link>
          <Link className="hover:text-yellow-300" to={defaultRoutes.REGISTER}>Register</Link>
          <Link className="hover:text-yellow-300" to={defaultRoutes.PROFILE}>Profile</Link>
          <Link className="hover:text-yellow-300" to={defaultRoutes.COLLECTION}>Collection</Link>
          <Link className="hover:text-yellow-300" to={defaultRoutes.DOSPAGE}>DOS</Link>
        <nav className="p-4 flex space-x-4 bg-gray-800">
          <Link to={defaultRoutes.HOME}>Home</Link>
          <Link to={defaultRoutes.GAME}>Game</Link>
          <Link to={defaultRoutes.LOGIN}>Login</Link>
          <Link to={defaultRoutes.REGISTER}>Register</Link>
          <Link to={defaultRoutes.PROFILE}>Profile</Link>
          <Link to={defaultRoutes.DOSPAGE}>DOS</Link>
        </nav>
        <div className="main p-4">
          <Routes>
            {mainRoutes.map(route => (
              <Route key={route.route} path={route.route} element={route.element} />
            ))}
          </Routes>
        </div>
      </div>
      <StarBackground />
    </Router>
  );
}

export default connect(null, {
  incrementCounter,
})(App);
