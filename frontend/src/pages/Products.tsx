import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, Product } from '../api/products';
import { getImageUrl } from '../utils/config';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdmin, user } = useAuth();
  
  // Necesită autentificare pentru a vedea produsele
  useProtectedRoute();

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data.products);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Sigur vrei să ștergi acest produs?')) return;

    try {
      await productsAPI.delete(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Eroare la ștergere');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>Produse</h1>
          {isAuthenticated && (
            <Link to="/products/new" className="btn btn-primary">
              + Adaugă Produs
            </Link>
          )}
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <p>Nu există produse încă.</p>
            {isAuthenticated && (
              <Link to="/products/new" className="btn btn-primary">
                Adaugă primul produs
              </Link>
            )}
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                {product.image_url && (
                  <img
                    src={getImageUrl(product.image_url) || ''}
                    alt={product.name}
                    className="product-image"
                  />
                )}
                <div className="product-info">
                  <h3>
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">{product.price} RON</p>
                  <div className="product-author">
                    {product.user_avatar_url && (
                      <img
                        src={getImageUrl(product.user_avatar_url) || ''}
                        alt={product.user_username || product.user_name}
                        className="author-avatar"
                      />
                    )}
                    <span>
                      de <strong>{product.user_username || product.user_name}</strong>
                    </span>
                  </div>
                  {isAuthenticated && (product.user_id === user?.id || isAdmin) && (
                    <div className="product-actions">
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="btn btn-secondary"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-danger"
                      >
                        Șterge
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}