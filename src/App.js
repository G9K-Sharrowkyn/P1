import './assets/Reset.css';
import './assets/General.css';
import './assets/Chat.css';
import './assets/Navigation.css'; 

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ChatMain from "./components/Chat/ChatMain.js";
import Home from "./components/Menu/Home.js";
import About from "./components/Menu/About.js";
import Navigation from "./components/Navigation/Navigation.js";
import Facebook from './components/Menu/Facebook.js';
import Discord from './components/Menu/Discord.js';
import Registration from './components/Menu/Registration.js';
import Rules from './components/Menu/Rules.js';
import SnakeGame from './components/Snake/SnakeGame.jsx'

function App() {
  return (
    <Router>
      <div className="layout">  
        <Navigation/>
          <div className="main">
            <Routes>
              <Route path="/chat" element={<ChatMain />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/facebook" element={<Facebook />} />
              <Route path="/discord" element={<Discord />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/snake" element={<SnakeGame />} />
            </Routes> 
          </div>
        </div>
      </Router>
    );
  }

export default App;
