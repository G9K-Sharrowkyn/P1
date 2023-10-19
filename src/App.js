import './assets/Reset.css';
import './assets/General.css';
import './assets/Chat.css';
import './assets/Navigation.css'; 

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ChatMain from "./components/Chat/ChatMain.js";
import Home from "./components/Game/Home.js";
import About from "./components/Game/About.js";
import Navigation from "./components/Navigation/Navigation.js";
import Facebook from './components/Game/Facebook.js';
import Discord from './components/Game/Discord.js';
import Registration from './components/Game/Registration.js';
import Rules from './components/Game/Rules.js';

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
              <Route path="/Facebook" element={<Facebook />} />
              <Route path="/Discord" element={<Discord />} />
              <Route path="/Registration" element={<Registration />} />
              <Route path="/Rules" element={<Rules />} />
            </Routes> 
          </div>
        </div>
      </Router>
    );
  }

export default App;
