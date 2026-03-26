import React, { useState } from 'react';

const LoginApp = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleLogin = async (e) => {
	  e.preventDefault();
	  
	  try {
		const response = await fetch('http://localhost:8001/api/auth/login', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ username, password })
		});

		if (response.ok) {
		  const data = await response.json();
		  localStorage.setItem('token', data.access_token); 
		  
		  if (window.updateShellAuth) {
			window.updateShellAuth();
		  } else {
			window.location.href = '/'; 
		  } 
		} else {
		  alert("Credenciais inválidas");
		}
	  } catch (error) {
		console.error("Erro no login", error);
	  }
	};

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>🔒 Acesso ao Sistema</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Usuário:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Senha:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '10px', background: '#00274d', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginApp;