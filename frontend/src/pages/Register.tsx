import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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
                          'A apărut o eroare la înregistrare. Te rugăm să încerci din nou.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>Înregistrare</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nume</label>
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
              <label htmlFor="username">Username (opțional)</label>
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
                Doar litere, cifre și underscore
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
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
              <label htmlFor="password">Password</label>
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
              {loading ? 'Loading...' : 'Înregistrează-te'}
            </button>
          </form>
          <p className="auth-link">
            Ai deja cont? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}