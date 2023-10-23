import './assets/Reset.css';
import './assets/General.css';
import './assets/Chat.css';
import './assets/Navigation.css'; 
import './assets/ContactForm.css'; 
import './assets/Facebook.css'; 
import './assets/Home.css'; 
import './assets/Registration.css'; 

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ChatMain from "./components/Chat/ChatMain.js";
import Home from "./components/Menu/Home.js";
import About from "./components/Menu/About.js";
import Navigation from "./components/Navigation/Navigation.js";
import Facebook from './components/Menu/Facebook.js';
import Discord from './components/Menu/Discord.js';
import Registration from './components/Menu/Registration.js';
import Rules from './components/Menu/Rules.js';
import SnakeGame from './components/Snake/SnakeGame.jsx';
import HomeMain from "./components/Home/HomeMain";
import Login from "./components/Registration-Menu/Login.js"
import Register from './components/Registration-Menu/Register';
import LostPassword from './components/Registration-Menu/LostPassword';
import ContactForm from './components/Registration-Menu/ContactForm';

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
              <Route path="/home-main" element={<HomeMain />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/lostpassword" element={<LostPassword />} />
              <Route path="/contactform" element={<ContactForm />} />
            </Routes> 
          </div>
        </div>
      </Router>
    );
  }

export default App;
