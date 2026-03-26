import React, { useState, useEffect } from 'react';

const OrdersApp = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error("Usuário não autenticado. Token ausente.");
        }

        const response = await fetch('http://localhost:8000/api/orders/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Padrão JWT (Bearer)
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401 || response.status === 403) {
          //localStorage.removeItem('token'); // Limpa a sujeira
          //window.location.href = '/login';  // Devolve o controle para o Shell rotear
		  setError("Sua sessão expirou ou o serviço de pedidos não reconheceu seu acesso.");
		  return;
        }

        if (!response.ok) {
          throw new Error(`Erro na comunicação com o servidor: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data);

      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', color: '#555' }}>Carregando a base de pedidos...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#fee', color: '#c00', border: '1px solid #c00', borderRadius: '4px' }}>
        <strong>Atenção:</strong> {error}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        Gestão de Pedidos
      </h2>
      
      {orders.length === 0 ? (
        <p style={{ color: '#666' }}>Nenhum pedido encontrado no banco de dados.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', color: '#444' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>ID do Pedido</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Descrição / Item</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ transition: 'background-color 0.2s' }}>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee', color: '#555' }}>#{order.id}</td>
                {/*  */}
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{order.descricao_item || order.nome}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  <span style={{ 
                    backgroundColor: order.status === 'Concluído' ? '#d4edda' : '#fff3cd', 
                    color: order.status === 'Concluído' ? '#155724' : '#856404',
                    padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', fontWeight: 'bold'
                  }}>
                    {order.status || 'Pendente'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersApp;