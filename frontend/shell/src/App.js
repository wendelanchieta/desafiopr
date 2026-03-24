import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

//Importação dinâmica do MFE remoto definido no Webpack
const LoginApp = React.lazy(() => import('authMFE/LoginApp'));
const OrdersApp = React.lazy(() => import('ordersMFE/OrdersApp'));

const Shell = () => {
	
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwt_token'));
  
  useEffect(() => {
    //Escuta o evento disparado pelo MFE de Login
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem('jwt_token'));
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);
  
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<div>Carregando Login...</div>}>
        <LoginApp />
      </Suspense>
    );
  }
  
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <header style={{ padding: '1rem', background: '#00274d', color: '#fff' }}>
          <h1>Gestão de Pedidos - Presidência da Republica</h1>
          <nav>
            <Link to="/" style={{ color: '#fff', marginRight: '15px' }}>Dashboard</Link>
            <Link to="/pedidos" style={{ color: '#fff' }}>Gestão de Pedidos</Link>
          </nav>
        </header>

        <main style={{ padding: '20px' }}>
          <Suspense fallback={<div>Carregando Módulo...</div>}>
            <Routes>
              <Route path="/" element={<h2>Bem-vindo ao Sistema Interno</h2>} />
              <Route path="/pedidos/*" element={<OrdersApp />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default Shell;