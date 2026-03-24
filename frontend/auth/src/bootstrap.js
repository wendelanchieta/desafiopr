import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginApp from './LoginApp';

const mount = (el) => {
  const root = ReactDOM.createRoot(el);
  root.render(<LoginApp />);
};

const devRoot = document.getElementById('login-dev-root') || document.getElementById('root');
if (devRoot) {
  mount(devRoot);
}

export default LoginApp; 
export { mount };