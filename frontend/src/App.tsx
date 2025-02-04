// frontend/src/App.tsx
import React, { useState } from 'react';
import Login from './components/Login.tsx';
import ProductList from './components/ProductList.tsx';
import CreateProduct from './components/CreateProduct.tsx';
import CreateOrder from './components/CreateOrder.tsx';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (jwtToken: string) => {
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <div style={{ padding: '20px' }}>
      {token ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <h1>Bienvenue dans l'e-commerce</h1>
          <ProductList token={token} />
          <hr />
          <CreateProduct token={token} />
          <hr />
          <CreateOrder token={token} />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
