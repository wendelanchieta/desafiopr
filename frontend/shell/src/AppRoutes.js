import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Suspense } from 'react';
import Layout from './Layout';
import AuthApp from 'authMFE/LoginApp';
import OrdersApp from 'ordersMFE/OrdersApp';

const AppRoutes = ({ isAuthenticated, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout}>
      <Suspense fallback={<div>Carregando módulo...</div>}>
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <AuthApp />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/*"
            element={isAuthenticated ? <OrdersApp /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default AppRoutes;