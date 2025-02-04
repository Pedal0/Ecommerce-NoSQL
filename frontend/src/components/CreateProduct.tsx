// frontend/src/components/CreateProduct.tsx
import React, { useState, FormEvent } from 'react';

interface CreateProductProps {
  token: string;
}

const CreateProduct: React.FC<CreateProductProps> = ({ token }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
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
    <div>
      <h2>Créer un Produit</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom du produit"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /><br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea><br />
        <input
          type="number"
          step="0.01"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        /><br />
        <input
          type="number"
          placeholder="Quantité"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        /><br />
        <input
          type="text"
          placeholder="Catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        /><br />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

export default CreateProduct;
