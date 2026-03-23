import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Importação dinâmica do MFE remoto definido no Webpack
const OrdersApp = React.lazy(() => import('ordersMFE/OrdersApp'));

const Shell = () => {
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