import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HOME_URL, LOGIN_URL } from "../common/modules";
import MainModularPage from "../mainPage/MainModularPage";
import { Login } from "../modules/Login";
import LoaderPage from "../ui-lib/loader/LoaderPage";
import { useSelector } from "react-redux";
import { getIsAuthorized, getIsTriedLoginWithEmptyString } from "../stores/AuthStore/selectors";
import { useLogin } from "../stores/AuthStore/hooks";
import { useRootDispatch } from "../stores";
import { fetchProjectsAndActive, fetchShouldRedirectUserToProjectPage } from "../stores/ProjectStore/actions";

const useInitApp = () => {
  const dispatch = useRootDispatch();
  useLogin();

  useEffect(() => {
    dispatch(fetchProjectsAndActive());
    dispatch(fetchShouldRedirectUserToProjectPage());
  }, []);
};

const ProtectedRoute = ({ children }: { children: React.JSX.Element }): React.JSX.Element => {
  const isAuthorized = useSelector(getIsAuthorized);
  const triedLoginWithEmptyString = useSelector(getIsTriedLoginWithEmptyString);

  if (!isAuthorized) {
    if (!triedLoginWithEmptyString) {
      return <LoaderPage />;
    }
    return <Navigate to={LOGIN_URL} replace />;
  }
  return children;
};

const AppRoutes = () => {
  useInitApp();

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
