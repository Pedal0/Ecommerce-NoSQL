// src/components/CreateProduct.tsx
import React, { useState, FormEvent } from 'react';

interface CreateProductProps {
  token: string;
}

const CreateProduct: React.FC<CreateProductProps> = ({ token }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const product = {
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      category,
    };

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Produit créé avec succès');
        setName('');
        setDescription('');
        setPrice('');
        setQuantity('');
        setCategory('');
      } else {
        alert(data.message || 'Erreur lors de la création du produit');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création du produit');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Créer un Produit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nom du produit"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        ></textarea>
        <input
          type="number"
          step="0.01"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Quantité"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Créer le produit
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
