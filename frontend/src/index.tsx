import React, { PropsWithChildren, ReactNode, useEffect } from "react";
import { ApiContextProvider } from "./contexts/ApiContext";
import { FlexLayoutContextProvider } from "./routing/flexLayout/FlexLayoutContext";
import "./assets/styles/index.scss";
import "./assets/styles/_base.scss";
import AppRoutes from "./routing/AppRoutes";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { updateColorTheme } from "./modules/themeModule/themeHelper";
import { GlobalThemeContextProvider } from "./modules/themeModule/GlobalThemeContext";
import { createRoot } from "react-dom/client";
import { AuthContextProvider } from "./modules/Login/context/AuthContext";
import { SnapshotsContextProvider } from "./modules/Snapshots/context/SnapshotsContext";
import { ProjectContextProvider } from "./modules/Project/context/ProjectContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { GraphContextProvider } from "./modules/GraphLibrary/context/GraphContext";
import { NodesContextProvider } from "./modules/Nodes/context/NodesContext";

type ProviderComponent = React.FC<PropsWithChildren<ReactNode>>;

const RouterProvider = process.env.USE_RELATIVE_PATHS === "true" ? HashRouter : BrowserRouter;

const contextProviders: ProviderComponent[] = [
  ApiContextProvider,
  FlexLayoutContextProvider,
  AuthContextProvider,
  RouterProvider,
  GraphContextProvider,
  NodesContextProvider,
  SnapshotsContextProvider,
];

const Application: React.FunctionComponent = () => {
  useEffect(updateColorTheme, []);
  return (
    <GlobalThemeContextProvider>
      <ProjectContextProvider>
        <WebSocketProvider>
          {contextProviders.reduce(
            (Comp, Provider) => {
              const TempProvider = Provider as unknown as React.FC<PropsWithChildren<object>>;
              return <TempProvider>{Comp}</TempProvider>;
            },
            <AppRoutes />
          )}
        </WebSocketProvider>
      </ProjectContextProvider>
    </GlobalThemeContextProvider>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Application />
    </React.StrictMode>
  );
}

// Register service worker for PWA functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
