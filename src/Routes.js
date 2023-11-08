import ChatMain from "./components/Chat/ChatMain.js";
import Home from "./components/Menu/Home.js";
import Facebook from './components/Menu/Facebook.js';
import Discord from './components/Menu/Discord.js';
import Rules from './components/Menu/Rules.js';
import SnakeGame from './components/Snake/SnakeGame.jsx';
import MalcadorArticle from "./components/Home/MalcadorArticle.js";
import ImperatorArticle from './components/Home/ImperatorArticle';
import DosPage from "./components/Dos/DosPage.js";
import Register from './components/Registration-Menu/Register';
import LostPassword from './components/Registration-Menu/LostPassword';
import ContactForm from './components/Registration-Menu/ContactForm';
import Articles from "./components/Menu/Articles.js";

export const defaultRoutes = {
    CHAT: "/chat",
    HOME: "/home",
    FACEBOOK: "/facebook",
    DISCORD: "/discord",
    RULES: "/rules",
    SNAKE: "/snake",
    MALCADORARTICLE: "/malcadorarticle",
    IMPERATORARTICLE: "/imperatorarticle",
    REGISTER: "/register",
    DOSPAGE: "/dospage",
    LOSTPASSWORD: "/lostpassword",
    CONTACTFORM: "/contactform",
    ARTICLES: "/articles",
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
        "route": "/dospage",
        "element": <DosPage commandLine="COMMAND.COM" />
    },
    {
        "route": "/lostpassword",
        "element": <LostPassword/>
    },
    {
        "route": "/contactform",
        "element": <ContactForm/>
    },
    {
        "route": "/articles",
        "element": <Articles/>
    },
];
