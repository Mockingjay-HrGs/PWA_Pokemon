import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

import { TeamProvider } from "./components/Game/TeamContext";
import { PokedexProvider } from "./components/Game/PokedexContext";
import { ThemeProvider } from "./theme/ThemeContext"; // si tu l'as

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
         <ThemeProvider>
        <TeamProvider>
            <PokedexProvider>
                <App />
            </PokedexProvider>
        </TeamProvider>
         </ThemeProvider>
    </React.StrictMode>
);

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
                console.log("Service Worker enregistré avec succès:", registration);
            })
            .catch((error) => {
                console.log("Échec de l'enregistrement du Service Worker:", error);
            });
    });
}
