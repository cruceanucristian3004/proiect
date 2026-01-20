import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articlesAPI, Article } from '../api/articles';
import './Articles.css';

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdmin, user } = useAuth();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await articlesAPI.getAll();
      setArticles(data.articles);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Sigur vrei să ștergi acest articol?')) return;

    try {
      await articlesAPI.delete(id);
      setArticles(articles.filter((a) => a.id !== id));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Eroare la ștergere');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="articles-page">
      <div className="container">
        <div className="page-header">
          <h1>Articole</h1>
          {isAuthenticated && (
            <Link to="/articles/new" className="btn btn-primary">
              + Scrie Articol
            </Link>
          )}
        </div>

        {articles.length === 0 ? (
          <div className="empty-state">
            <p>Nu există articole încă.</p>
            {isAuthenticated && (
              <Link to="/articles/new" className="btn btn-primary">
                Scrie primul articol
              </Link>
            )}
          </div>
        ) : (
          <div className="articles-list">
            {articles.map((article) => (
              <article key={article.id} className="article-card">
                {article.image_url && (
                  <img
                    src={`http://localhost:3000${article.image_url}`}
                    alt={article.title}
                    className="article-image"
                  />
                )}
                <div className="article-content">
                  <h2>
                    <Link to={`/articles/${article.id}`}>{article.title}</Link>
                  </h2>
                  <p className="article-excerpt">
                    {article.content.substring(0, 150)}...
                  </p>
                  <div className="article-meta">
                    <span>de {article.user_name}</span>
                    <span>•</span>
                    <span>{new Date(article.created_at).toLocaleDateString('ro-RO')}</span>
                  </div>
                  {isAuthenticated && (article.user_id === user?.id || isAdmin) && (
                    <div className="article-actions">
                      <Link
                        to={`/articles/${article.id}/edit`}
                        className="btn btn-secondary"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="btn btn-danger"
                      >
                        Șterge
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}