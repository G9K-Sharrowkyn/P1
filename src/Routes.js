import DosPage from "./components/Dos/DosPage.js";

export const defaultRoutes = {
    DOSPAGE: "/dospage",
}

export const routes = [
    {
        "route": "/dospage",
        "element": <DosPage commandLine="COMMAND.COM" />
    },
];
