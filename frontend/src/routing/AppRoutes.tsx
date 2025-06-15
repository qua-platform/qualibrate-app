import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HOME_URL, LOGIN_URL } from "../common/modules";
import MainModularPage from "../mainPage/MainModularPage";
import { Login } from "../modules/Login";
import { useAuthContext } from "../modules/Login/context/AuthContext";
import LoaderPage from "../ui-lib/loader/LoaderPage";
import { ProjectContextProvider } from "../modules/Project/context/ProjectContext";

const ProtectedRoute = ({ children }: { children: React.JSX.Element }): React.JSX.Element => {
  const { isAuthorized, triedLoginWithEmptyString } = useAuthContext();

  if (!isAuthorized) {
    if (!triedLoginWithEmptyString) {
      return <LoaderPage />;
    }
    return <Navigate to={LOGIN_URL} replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path={LOGIN_URL} element={<Login />} />
        <Route
          path={HOME_URL}
          element={
            <ProtectedRoute>
                <MainModularPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Navigate to={"/"} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
