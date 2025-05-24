import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../../components/loging/Login';
import getRoutes from '../../routes';
import { useTranslation } from 'react-i18next';

export default function Auth({ setUser }) {
  const { t } = useTranslation(); // ✅ get t()
  const routes = getRoutes(t);    // ✅ call getRoutes with t

  const getRoutesForAuth = () => {
    return routes.map((prop, key) => {
      if (prop.layout === '/auth') {
        return (
          <Route
            path={`/${prop.path}`}
            element={<Login setUser={setUser} />}
            key={key}
          />
        );
      }
      return null;
    });
  };

  document.documentElement.dir = 'ltr';

  return (
    <div className="flex items-center justify-center">
      <Routes>{getRoutesForAuth()}</Routes>
    </div>
  );
}
