import DosPage from "./components/Dos/DosPage.js";
import HuangjunGame from './components/Huangjun/HuangjunGame';

export const defaultRoutes = {
    DOSPAGE: "/dospage",
    HUANGJUN: "/huangjun",  // ← dodajemy nową trasę
};

export const routes = [
    {
        route: "/dospage",
        element: <DosPage commandLine="COMMAND.COM" />
    },
    {
        route: "/huangjun",    // ← nowy route
        element: <HuangjunGame />
    }
];
