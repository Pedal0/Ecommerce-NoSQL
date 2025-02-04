// frontend/src/components/ProductList.tsx
import React, { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
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
      <h2>Liste des Produits</h2>
      {products.length === 0 ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <strong>{product.name}</strong> - {product.price} €
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
