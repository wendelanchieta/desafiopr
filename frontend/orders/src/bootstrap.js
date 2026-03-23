import React from 'react';
import ReactDOM from 'react-dom/client';
import OrdersApp from './OrdersApp';

// Se estivermos rodando isoladamente (fora do Shell)
const devRoot = document.getElementById('orders-dev-root');
if (devRoot) {
  const root = ReactDOM.createRoot(devRoot);
  root.render(<OrdersApp />);
}

// Export para o Module Federation
export { OrdersApp };