import React, { PropsWithChildren, ReactNode, useEffect } from "react";
import { ApiContextProvider } from "./contexts/ApiContext";
import { FlexLayoutContextProvider } from "./routing/flexLayout/FlexLayoutContext";
import "./assets/styles/index.scss";
import "./assets/styles/_base.scss";
import AppRoutes from "./routing/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { updateColorTheme } from "./modules/themeModule/themeHelper";
import { GlobalThemeContextProvider } from "./modules/themeModule/GlobalThemeContext";
import { createRoot } from "react-dom/client";

type ProviderComponent = React.FC<PropsWithChildren<ReactNode>>;

const contextProviders: ProviderComponent[] = [ApiContextProvider, FlexLayoutContextProvider, BrowserRouter];

const Application: React.FunctionComponent = () => {
  useEffect(updateColorTheme, []);
  return (
    <GlobalThemeContextProvider>
      {contextProviders.reduce(
        (Comp, Provider) => {
          const TempProvider = Provider as unknown as React.FC<PropsWithChildren<object>>;
          return <TempProvider>{Comp}</TempProvider>;
        },
        <AppRoutes />
      )}
    </GlobalThemeContextProvider>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>
);
