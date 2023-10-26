import ChatMain from "./components/Chat/ChatMain.js";
import Home from "./components/Menu/Home.js";
import Help from "./components/Menu/Help.js";
import Facebook from './components/Menu/Facebook.js';
import Discord from './components/Menu/Discord.js';
import Rules from './components/Menu/Rules.js';
import SnakeGame from './components/Snake/SnakeGame.jsx';
import MalcadorArticle from "./components/Home/MalcadorArticle.js";
import ImperatorArticle from './components/Home/ImperatorArticle';
import Login from "./components/Registration-Menu/Login.js"
import Register from './components/Registration-Menu/Register';
import LostPassword from './components/Registration-Menu/LostPassword';
import ContactForm from './components/Registration-Menu/ContactForm';

export const defaultRoutes = {
    CHAT: "/chat",
    HOME: "/home",
    HELP: "/help",
    FACEBOOK: "/facebook",
    DISCORD: "/discord",
    RULES: "/rules",
    SNAKE: "/snake",
    MALCADORARTICLE: "/malcadorarticle",
    IMPERATORARTICLE: "/imperatorarticle",
    REGISTER: "/register",
    LOGIN: "/login",
    LOSTPASSWORD: "/lostpassword",
    CONTACTFORM: "/contactform"
}

export const routes = [
    {
       "route": "/chat",
       "element": <ChatMain />
    },
    {
       "route": "/home",
       "element": <Home />
    },
    {
       "route": "/help",
       "element": <Help />
    },
    {
       "route": "/facebook",
       "element": <Facebook />
    },
    {
        "route": "/discord",
        "element": <Discord />
    },
    {
        "route": "/rules",
        "element": <Rules />
    },
    {
        "route": "/snake",
        "element": <SnakeGame />
    },
    {
        "route": "/malcadorarticle",
        "element": <MalcadorArticle/>
    },
    {
        "route": "/imperatorarticle",
        "element": <ImperatorArticle/>
    },
    {
        "route": "/register",
        "element": <Register/>
    },
    {
        "route": "/login",
        "element": <Login/>
    },
    {
        "route": "/lostpassword",
        "element": <LostPassword/>
    },
    {
        "route": "/contactform",
        "element": <ContactForm/>
    },
];
