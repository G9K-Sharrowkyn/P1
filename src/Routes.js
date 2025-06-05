import DosPage from "./components/Dos/DosPage.js";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import ProfilePage from "./components/Auth/ProfilePage";
import CollectionPage from "./components/Auth/CollectionPage";
import CardInfo from "./components/Cards/CardInfo";

export const defaultRoutes = {
    HOME: "/",
    DOSPAGE: "/dospage",
    LOGIN: "/login",
    REGISTER: "/register",
    PROFILE: "/profile",
    COLLECTION: "/collection",
    GAME: "/game",
};

export const routes = [
    { route: defaultRoutes.HOME, element: <CardInfo /> },
    { route: defaultRoutes.DOSPAGE, element: <DosPage commandLine="COMMAND.COM" /> },
    { route: defaultRoutes.LOGIN, element: <LoginPage /> },
    { route: defaultRoutes.REGISTER, element: <RegisterPage /> },
    { route: defaultRoutes.PROFILE, element: <ProfilePage /> },
    { route: defaultRoutes.COLLECTION, element: <CollectionPage /> },
    { route: defaultRoutes.GAME, element: <CardInfo /> },
];
