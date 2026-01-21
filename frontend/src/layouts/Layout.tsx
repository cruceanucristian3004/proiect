import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getImageUrl } from '../utils/config';
import './Layout.css';

export default function Layout() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="logo">
              <img src="/logo.svg" alt="Nova Resells" className="logo-image" />
              <span className="logo-text">Nova Resells</span>
            </Link>
            <div className="nav-links">
              <div className="language-selector">
                <button
                  className={`lang-btn ${language === 'ro' ? 'active' : ''}`}
                  onClick={() => setLanguage('ro')}
                  title="Română"
                >
                  RO
                </button>
                <button
                  className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                  onClick={() => setLanguage('en')}
                  title="English"
                >
                  EN
                </button>
              </div>
              <Link to="/products">{t('nav.products')}</Link>
              <Link to="/articles">{t('nav.articles')}</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile">{t('nav.profile')}</Link>
                  <div className="user-profile">
                    <Link to="/profile" className="user-avatar-link">
                      {user?.avatar_url ? (
                        <img
                          src={getImageUrl(user.avatar_url) || ''}
                          alt={user?.username || user?.name}
                          className="user-avatar"
                        />
                      ) : (
                        <div className="user-avatar-placeholder">
                          {(user?.username || user?.name)?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Link>
                    <span className="user-info">{user?.username || user?.name}</span>
                  </div>
                  {isAdmin && <span className="admin-badge">{t('nav.admin')}</span>}
                  <button onClick={handleLogout} className="btn-logout">
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">{t('nav.login')}</Link>
                  <Link to="/register">{t('nav.register')}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Nova Resells. {t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}