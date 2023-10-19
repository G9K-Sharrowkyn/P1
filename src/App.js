import './assets/reset.css';
import './assets/general.css';
import './assets/App.css';
import Chat from './components/Chat/Chat.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Game/Home.js";
import Navigation from "./components/Navigation/Navigation.js";
import './assets/Navigation.css'; 

function App() {
  return (
  <Router>
    <div className="layout">  
    <Navigation/>
      <div className="main">
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/home" element={<Home />} />
        </Routes> 
      </div>
    </div>
  </Router>
  );
}

export default App;
