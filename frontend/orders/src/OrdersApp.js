import React, { useEffect, useState } from 'react';

const OrdersApp = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Integração com o backend que criamos no Docker (porta 8000)
    fetch('http://localhost:8000/api/orders/')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Erro ao buscar pedidos:", err));
  }, []);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <h3>📦 Módulo de Gestão de Pedidos</h3>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee' }}>
            <th>ID</th>
            <th>Cliente</th>
            <th>Item</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
              <td>#{order.id}</td>
              <td>{order.nome}</td>
              <td>{order.descricao_item}</td>
              <td>
                <span style={{ 
                  background: order.status.includes('ALTA') ? '#ffcccc' : '#e2e2e2',
                  padding: '4px 8px', borderRadius: '4px' 
                }}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersApp;