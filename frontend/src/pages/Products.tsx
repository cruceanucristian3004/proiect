import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { productsAPI, Product } from '../api/products';
import { getImageUrl } from '../utils/config';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { t } = useLanguage();
  
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
    if (!window.confirm(t('products.deleteConfirm'))) return;

    try {
      await productsAPI.delete(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error: any) {
      alert(error.response?.data?.error || t('products.deleteError'));
    }
  };

  if (loading) {
    return <div className="loading">{t('products.loading')}</div>;
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>{t('products.title')}</h1>
          {isAuthenticated && (
            <Link to="/products/new" className="btn btn-primary">
              {t('products.add')}
            </Link>
          )}
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <p>{t('products.empty')}</p>
            {isAuthenticated && (
              <Link to="/products/new" className="btn btn-primary">
                {t('products.addFirst')}
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
                      {t('products.publishedBy')} <strong>{product.user_username || product.user_name}</strong>
                    </span>
                  </div>
                  {isAuthenticated && (product.user_id === user?.id || isAdmin) && (
                    <div className="product-actions">
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="btn btn-secondary"
                      >
                        {t('products.edit')}
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-danger"
                      >
                        {t('products.delete')}
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