import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AlertProvider, LanguageProvider } from "./context";
import App from "./App.tsx";
import "./index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <AlertProvider>
        <App />
      </AlertProvider>
    </LanguageProvider>
  </StrictMode>,
);
