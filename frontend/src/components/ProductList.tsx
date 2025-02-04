// src/components/ProductList.tsx
import React, { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
}

interface ProductListProps {
  token: string;
}

const ProductList: React.FC<ProductListProps> = ({ token }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Liste des Produits</h2>
      {products.length === 0 ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product._id} className="border border-gray-300 p-3 rounded shadow-sm">
              <div className="flex justify-between">
                <span className="font-semibold">{product.name}</span>
                <span className="text-green-600 font-bold">{product.price} €</span>
              </div>
              {product.description && <p className="text-gray-600 text-sm">{product.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
