// frontend/src/components/CreateOrder.tsx
import React, { useState, FormEvent } from 'react';

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
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const orderData: OrderData = {
      items: [
        {
          product: productId,
          quantity: parseInt(quantity, 10),
          price: parseFloat(price)
        }
      ],
      paymentDetails: {
        method: paymentMethod,
        status: 'en attente'
      }
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Commande créée avec succès');
        // Réinitialisation des champs
        setProductId('');
        setQuantity('');
        setPrice('');
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
    <div>
      <h2>Passer une Commande</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID du produit"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
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
          type="number"
          step="0.01"
          placeholder="Prix unitaire"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        /><br />
        <input
          type="text"
          placeholder="Méthode de paiement"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          required
        /><br />
        <button type="submit">Passer commande</button>
      </form>
    </div>
  );
};

export default CreateOrder;
