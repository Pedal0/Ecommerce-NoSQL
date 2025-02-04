// src/App.tsx
import React, { useState } from 'react';
import Register from './components/Register.tsx';
import Login from './components/Login.tsx';
import ProductList from './components/ProductList.tsx';
import CreateProduct from './components/CreateProduct.tsx';
import CreateOrder from './components/CreateOrder.tsx';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [view, setView] = useState<'register' | 'login' | 'products' | 'createProduct' | 'createOrder'>('login');

  const handleLogin = (jwtToken: string) => {
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    setView('products');
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setView('login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-md mb-4">
        <h1 className="text-xl font-bold">E-commerce App</h1>
        {token && <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">Logout</button>}
      </header>

      {/* Navigation simple */}
      {token ? (
        <nav className="flex gap-4 mb-4">
          <button onClick={() => setView('products')} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Produits</button>
          <button onClick={() => setView('createProduct')} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Créer Produit</button>
          <button onClick={() => setView('createOrder')} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded">Passer Commande</button>
        </nav>
      ) : (
        <nav className="flex gap-4 mb-4">
          <button onClick={() => setView('register')} className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded">Register</button>
          <button onClick={() => setView('login')} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Login</button>
        </nav>
      )}

      <main className="bg-white p-6 rounded-md shadow-md">
        {view === 'register' && <Register onRegister={() => setView('login')} />}
        {view === 'login' && <Login onLogin={handleLogin} />}
        {view === 'products' && token && <ProductList token={token} />}
        {view === 'createProduct' && token && <CreateProduct token={token} />}
        {view === 'createOrder' && token && <CreateOrder token={token} />}
      </main>
    </div>
  );
};

export default App;
