import './assets/css/Reset.css';
import './assets/css/General.css';
import './assets/css/Chat.css';
import './assets/css/Navigation.css'; 
import './assets/css/ContactForm.css'; 
import './assets/css/Facebook.css'; 
import './assets/css/Home.css'; 
import './assets/css/Registration.css'; 
import './assets/css/MouseTracker.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from './components/Header/Header';
import Navigation from "./components/Navigation/Navigation.js";
import MouseTracker from './components/MouseChase/MouseTracker';
import ClickCounter from './components/MouseChase/ClickCounter.js';
import AudioPlayer from './components/Menu/AudioPlayer.js';
// import WelcomeScreen from './components/Navigation/WelcomeScreen';
import { routes as mainRoutes } from './Routes';

function App() {
  return (
    <Router>
      <div className="layout">  
        <Header/>
        <ClickCounter />
        <MouseTracker/>
        <Navigation/>
        <AudioPlayer src="src/assets/music/The Four Seasons - Summer - Presto.mp3" />
          <div className="main">
          {/* <WelcomeScreen /> */}
          <Routes>
            {mainRoutes.map((route) => (
              <Route key={route.route} path={route.route} element={route.element} />
              ))}
              </Routes>
          </div>
        </div>
      </Router>
    );
  }

export default App;
