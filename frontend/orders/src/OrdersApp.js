import React, { useState, useEffect } from 'react';

const OrdersApp = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(''); // <-- filtro
  const [createForm, setCreateForm] = useState({ nome: '', descricao_item: '', status:'Pendente', quantidade: 1 }); // <-- form

  // Busca pedidos (com filtro)
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Usuário não autenticado.");

        const url = new URL('http://localhost:8000/api/orders/');
        if (statusFilter) url.searchParams.append('status', statusFilter);

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401 || response.status === 403) {
          setError("Sua sessão expirou ou o serviço de pedidos não reconheceu seu acesso.");
          return;
        }

        if (!response.ok) throw new Error(`Erro: ${response.status}`);

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
  }, [statusFilter]); // <-- depende do filtro

  // Cria novo pedido
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Usuário não autenticado.");

      const response = await fetch('http://localhost:8000/api/orders/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: createForm.nome,
          descricao_item: createForm.descricao_item,
          status:'Pendente', 
          quantidade: 1 
        })
      });

      if (!response.ok) throw new Error(`Erro ao criar pedido: ${response.status}`);

      const newOrder = await response.json();
      setOrders((prev) => [newOrder, ...prev]); // Adiciona na lista
      setCreateForm({ nome: '', descricao_item: '' }); // Limpa o form
      alert('Pedido criado com sucesso!');
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
      alert(err.message);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', color: '#555' }}>Carregando pedidos...</div>;
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

      {/* Filtro por status */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Filtrar por status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '6px', borderRadius: '4px', fontSize: '1em' }}
        >
          <option value="">Todos</option>
          <option value="Pendente">Pendente</option>
          <option value="Em Processamento">Em Processamento</option>
          <option value="Concluído">Concluído</option>
        </select>
      </div>

      {/* Formulário de criação */}
      <form
        onSubmit={handleCreate}
        style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}
      >
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Nome:
          <input
            type="text"
            value={createForm.nome}
            onChange={(e) => setCreateForm({ ...createForm, nome: e.target.value })}
            required
            style={{ width: '10%', padding: '8px', marginTop: '4px', borderRadius: '4px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Descrição do item:
          <input
            type="text"
            value={createForm.descricao_item}
            onChange={(e) => setCreateForm({ ...createForm, descricao_item: e.target.value })}
            required
            style={{ width: '90%', padding: '8px', marginTop: '4px', borderRadius: '4px' }}
          />
        </label>
        <button
          type="submit"
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            backgroundColor: '#00274d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Criar Pedido
        </button>
      </form>

      {/* Tabela de pedidos */}
      {orders.length === 0 ? (
        <p style={{ color: '#666' }}>Nenhum pedido encontrado.</p>
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