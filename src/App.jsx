import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from 'layouts/admin';
import AuthLayout from 'layouts/auth';
import ForgotPassword from 'components/loging/ForgotPassword';

function App() {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    // Watch for user login/logout updates
    const handleStorageChange = () => {
      const stored = sessionStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          user ? (
            <AdminLayout user={user} setUser={setUser} />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />


      <Route
        path="/auth/*"
        element={
          user ? (
            <Navigate to="/admin" replace />
          ) : (
            <AuthLayout setUser={setUser} />
          )
        }
      />
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default App;
