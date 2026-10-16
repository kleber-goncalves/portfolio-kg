import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import App from "./App.jsx";

// Mensagem de boas-vindas para quem explora o DevTools.
console.log(
    "%cKLEBER DEV\n%cSó analisando o código, né? 👀\n%cExplore o projeto com curiosidade e respeito. Não execute comandos que você não conhece.",
    "color: #C49A78; font-size: 22px; font-weight: 800; letter-spacing: 2px; padding: 4px 0;",
    "color: #F2F0EC; font-size: 13px; font-weight: 600; padding-top: 6px;",
    "color: #8B8B8B; font-size: 11px; line-height: 1.6;",
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
