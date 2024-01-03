import './assets/css/Reset.css';
import './assets/css/General.css';
import './assets/css/Chat.css';
import './assets/css/Navigation.css';
import './assets/css/ContactForm.css';
import './assets/css/Facebook.css';
import './assets/css/Home.css';
import './assets/css/Registration.css';
import './assets/css/MouseTracker.css';
import './assets/scss/Form.scss';
import './assets/css/CardGame.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes as mainRoutes } from './Routes';
import React, { useEffect } from "react";

import Header from './components/Header/Header';
import Navigation from "./components/Navigation/Navigation.js";
import AudioPlayer from './components/Menu/AudioPlayer.js';
import StarBackground from './components/Background/StarBackground.js';
// import WelcomeScreen from './components/Navigation/WelcomeScreen';
// import CardInfo from './components/Cards/CardInfo.js';

import { connect } from 'react-redux';
import { incrementCounter } from './actions/counter.actions.js'

function App({ incrementCounter }) {

  useEffect(() => {
    const clickHandler = e => {
      if(e.target.localName === 'a' || e.target.localName === 'button'){
        //btn was clicked
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
      <div className="main-container bg-black">
        <Header />
        <Navigation />
        <div className="flex justify-end">
          <div className="flex flex-col space-y-2 mr-4 mt-[-60px]">

            <AudioPlayer src="src/assets/music/The Four Seasons - Summer - Presto.mp3" />
            {/* <CardInfo></CardInfo> */}
          </div>
        </div>
        <div className="main">
          {/* <WelcomeScreen /> */}
          <Routes>
            {mainRoutes.map((route) => (
              <Route key={route.route} path={route.route} element={route.element} />
            ))}
          </Routes>
        </div>
      </div>
      <StarBackground/>
    </Router>
  );
}

export default connect(null, {
  incrementCounter
})(App)
