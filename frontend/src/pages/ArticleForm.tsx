import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articlesAPI, Article } from '../api/articles';
import { getImageUrl } from '../utils/config';
import './Form.css';

export default function ArticleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
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
      loadArticle();
    }
  }, [id, isAuthenticated]);

  const loadArticle = async () => {
    try {
      const data = await articlesAPI.getOne(id!);
      const article = data.article;
      setFormData({
        title: article.title,
        content: article.content,
      });
      if (article.image_url) {
        setPreviewUrl(getImageUrl(article.image_url) || '');
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
        await articlesAPI.update(id!, {
          title: formData.title,
          content: formData.content,
        });
      } else {
        await articlesAPI.create(
          {
            title: formData.title,
            content: formData.content,
          },
          imageFile || undefined
        );
      }
      navigate('/articles');
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
        <Link to="/articles" className="back-link">← Înapoi la Articole</Link>
        <div className="form-card">
          <h1>{isEdit ? 'Editează Articol' : 'Scrie Articol Nou'}</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Titlu *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Titlul articolului"
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
            <div className="form-group">
              <label htmlFor="content">Conținut *</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                required
                placeholder="Scrie conținutul articolului aici..."
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Salvare...' : isEdit ? 'Actualizează Articol' : 'Publică Articol'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}