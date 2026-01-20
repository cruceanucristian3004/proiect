import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, Product } from '../api/products';
import { getImageUrl } from '../utils/config';
import './Form.css';

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const isEdit = !!id;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isEdit) {
      loadProduct();
    }
  }, [id, isAuthenticated]);

  const loadProduct = async () => {
    try {
      const data = await productsAPI.getOne(id!);
      const product = data.product;
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
      });
      if (product.image_url) {
        setPreviewUrl(getImageUrl(product.image_url) || '');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Eroare la încărcare');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await productsAPI.update(id!, {
          name: formData.name,
          description: formData.description || undefined,
          price: parseFloat(formData.price),
        });
      } else {
        await productsAPI.create(
          {
            name: formData.name,
            description: formData.description || undefined,
            price: parseFloat(formData.price),
          },
          imageFile || undefined
        );
      }
      navigate('/products');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Eroare la salvare');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="form-page">
      <div className="container">
        <Link to="/products" className="back-link">← Înapoi la Produse</Link>
        <div className="form-card">
          <h1>{isEdit ? 'Editează Produs' : 'Adaugă Produs Nou'}</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nume Produs *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ex: Laptop Dell"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Descriere</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Descriere produs..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Preț (RON) *</label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="0.00"
              />
            </div>
            {!isEdit && (
              <div className="form-group">
                <label htmlFor="image">Imagine</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="image-preview" />
                )}
              </div>
            )}
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Salvare...' : isEdit ? 'Actualizează' : 'Adaugă Produs'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}