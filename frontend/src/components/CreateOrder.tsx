// src/components/CreateOrder.tsx
import React, { useState, useEffect, FormEvent } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface CreateOrderProps {
  token: string;
}

interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

interface PaymentDetails {
  method: string;
  status: string;
}

interface OrderData {
  items: OrderItem[];
  paymentDetails: PaymentDetails;
}

const CreateOrder: React.FC<CreateOrderProps> = ({ token }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedProductPrice, setSelectedProductPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<string>('1');
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  // Récupérer la liste des produits pour le dropdown
  useEffect(() => {
    fetch('http://localhost:5000/api/products', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        if (data.length > 0) {
          setSelectedProductId(data[0]._id);
          setSelectedProductPrice(data[0].price);
        }
      })
      .catch(err => console.error(err));
  }, [token]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prodId = e.target.value;
    setSelectedProductId(prodId);
    const prod = products.find(p => p._id === prodId);
    if (prod) {
      setSelectedProductPrice(prod.price);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orderData: OrderData = {
      items: [
        {
          product: selectedProductId,
          quantity: parseInt(quantity, 10),
          price: selectedProductPrice,
        },
      ],
      paymentDetails: {
        method: paymentMethod,
        status: 'en attente',
      },
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Commande créée avec succès');
        setQuantity('1');
        setPaymentMethod('');
      } else {
        alert(data.message || 'Erreur lors de la création de la commande');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création de la commande');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Passer une Commande</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Produit</span>
          <select
            value={selectedProductId}
            onChange={handleProductChange}
            className="mt-1 block w-full border border-gray-300 p-2 rounded"
          >
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} - {product.price} €
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-gray-700">Quantité</span>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded"
            required
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Méthode de paiement</span>
          <input
            type="text"
            placeholder="Ex : carte bancaire, PayPal"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded"
            required
          />
        </label>
        <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600">
          Passer commande
        </button>
      </form>
    </div>
  );
};

export default CreateOrder;
