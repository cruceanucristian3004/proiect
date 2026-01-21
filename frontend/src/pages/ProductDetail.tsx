import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { productsAPI, Product } from '../api/products';
import { getImageUrl } from '../utils/config';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import './Detail.css';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Necesită autentificare
  useProtectedRoute();

  useEffect(() => {
    if (id && isAuthenticated) {
      loadProduct();
    }
  }, [id, isAuthenticated]);

  const loadProduct = async () => {
    try {
      const data = await productsAPI.getOne(id!);
      setProduct(data.product);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t('products.deleteConfirm'))) return;

    try {
      await productsAPI.delete(id!);
      navigate('/products');
    } catch (error: any) {
      alert(error.response?.data?.error || t('products.deleteError'));
    }
  };

  if (loading) {
    return <div className="loading">{t('products.loading')}</div>;
  }

  if (!product) {
    return <div className="error">{t('products.notFound')}</div>;
  }

  const dateLocale = language === 'ro' ? 'ro-RO' : 'en-US';

  return (
    <div className="detail-page">
      <div className="container">
        <Link to="/products" className="back-link">{t('products.back')}</Link>
        <div className="detail-card">
          {product.image_url && (
            <img
              src={getImageUrl(product.image_url) || ''}
              alt={product.name}
              className="detail-image"
            />
          )}
          <div className="detail-content">
            <h1>{product.name}</h1>
            <p className="detail-price">{product.price} RON</p>
            {product.description && (
              <div className="detail-description">
                <h3>{t('products.description')}</h3>
                <p>{product.description}</p>
              </div>
            )}
            <div className="detail-meta">
              <div className="detail-author">
                {product.user_avatar_url && (
                  <img
                    src={getImageUrl(product.user_avatar_url) || ''}
                    alt={product.user_username || product.user_name}
                    className="author-avatar-large"
                  />
                )}
                <div className="author-info">
                  <span className="author-label">{t('products.publishedBy')}</span>
                  <strong className="author-name">
                    {product.user_username || product.user_name}
                  </strong>
                  <span className="author-date">
                    {t('products.publishedOn')} {new Date(product.created_at).toLocaleDateString(dateLocale)}
                  </span>
                </div>
              </div>
            </div>
            {user && (product.user_id === user.id || isAdmin) && (
              <div className="detail-actions">
                <Link
                  to={`/products/${product.id}/edit`}
                  className="btn btn-primary"
                >
                  {t('products.edit')}
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  {t('products.delete')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}