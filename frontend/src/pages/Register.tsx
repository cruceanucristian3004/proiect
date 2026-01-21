import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password, name, username || undefined);
      navigate('/');
    } catch (err: any) {
      // Extrage mesajul de eroare din răspuns
      const errorMessage = err.response?.data?.error || 
                          err.message || 
                          t('auth.register.error');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>{t('auth.register.title')}</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{t('auth.register.name')}</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ion Popescu"
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">{t('auth.register.username')}</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
                maxLength={30}
                pattern="[a-zA-Z0-9_]+"
                placeholder="ion_popescu"
              />
              <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
                {t('auth.register.usernameHint')}
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="email">{t('auth.register.email')}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">{t('auth.register.password')}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? t('auth.register.loading') : t('auth.register.submit')}
            </button>
          </form>
          <p className="auth-link">
            {t('auth.register.hasAccount')} <Link to="/login">{t('nav.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}