import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
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
              <Link to="/products">Produse</Link>
              <Link to="/articles">Articole</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile">Profil</Link>
                  <div className="user-profile">
                    <Link to="/profile" className="user-avatar-link">
                      {user?.avatar_url ? (
                        <img
                          src={`http://localhost:3000${user.avatar_url}`}
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
                  {isAdmin && <span className="admin-badge">Admin</span>}
                  <button onClick={handleLogout} className="btn-logout">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
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
          <p>&copy; 2024 Nova Resells. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </div>
  );
}