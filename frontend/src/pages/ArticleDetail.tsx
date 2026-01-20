import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articlesAPI, Article } from '../api/articles';
import './Detail.css';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      const data = await articlesAPI.getOne(id!);
      setArticle(data.article);
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Sigur vrei să ștergi acest articol?')) return;

    try {
      await articlesAPI.delete(id!);
      navigate('/articles');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Eroare la ștergere');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!article) {
    return <div className="error">Articolul nu a fost găsit</div>;
  }

  return (
    <div className="detail-page">
      <div className="container">
        <Link to="/articles" className="back-link">← Înapoi la Articole</Link>
        <div className="detail-card">
          {article.image_url && (
            <img
              src={`http://localhost:3000${article.image_url}`}
              alt={article.title}
              className="detail-image"
            />
          )}
          <div className="detail-content">
            <h1>{article.title}</h1>
            <div className="detail-description">
              <p style={{ whiteSpace: 'pre-wrap' }}>{article.content}</p>
            </div>
            <p className="detail-meta">
              Scris de {article.user_name} pe{' '}
              {new Date(article.created_at).toLocaleDateString('ro-RO')}
            </p>
            {user && (article.user_id === user.id || isAdmin) && (
              <div className="detail-actions">
                <Link
                  to={`/articles/${article.id}/edit`}
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