import React from 'react';

const Layout = ({ children, isAuthenticated, handleLogout }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {isAuthenticated && (
        <header style={{ padding: '15px 30px', backgroundColor: '#2c3e50', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Painel Corporativo</h2>
          <button 
            onClick={handleLogout} 
            style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
          >
            Sair
          </button>
        </header>
      )}
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#f4f6f8' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;