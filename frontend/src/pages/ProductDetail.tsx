import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, Product } from '../api/products';
import { getImageUrl } from '../utils/config';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import './Detail.css';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, isAuthenticated } = useAuth();
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
    if (!window.confirm('Sigur vrei să ștergi acest produs?')) return;

    try {
      await productsAPI.delete(id!);
      navigate('/products');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Eroare la ștergere');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return <div className="error">Produsul nu a fost găsit</div>;
  }

  return (
    <div className="detail-page">
      <div className="container">
        <Link to="/products" className="back-link">← Înapoi la Produse</Link>
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
                <h3>Descriere</h3>
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
                  <span className="author-label">Publicat de</span>
                  <strong className="author-name">
                    {product.user_username || product.user_name}
                  </strong>
                  <span className="author-date">
                    pe {new Date(product.created_at).toLocaleDateString('ro-RO')}
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
                  Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  Șterge
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}