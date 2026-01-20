import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import './Profile.css';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
  });
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    const nameChanged = formData.name !== user.name;
    const usernameChanged = formData.username !== (user.username || '');
    const avatarChanged = pendingAvatar !== null;
    
    setHasChanges(nameChanged || usernameChanged || avatarChanged);
  }, [formData, pendingAvatar, user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Fișierul trebuie să fie o imagine');
      return;
    }

    // Preview avatar
    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Upload avatar dacă există
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        const avatarResponse = await authAPI.uploadAvatar(file);
        updateUser(avatarResponse.user);
        setPendingAvatar(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }

      // Actualizează profilul dacă există modificări
      const nameChanged = formData.name !== user?.name;
      const usernameChanged = formData.username !== (user?.username || '');
      
      if (nameChanged || usernameChanged) {
        const profileResponse = await authAPI.updateProfile({
          name: formData.name !== user?.name ? formData.name : undefined,
          username: formData.username !== (user?.username || '') ? formData.username : undefined,
        });
        updateUser(profileResponse.user);
      }

      setSuccess('Profil actualizat cu succes!');
      setHasChanges(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Eroare la actualizarea profilului');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
      });
    }
    setPendingAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError('');
    setSuccess('');
    setHasChanges(false);
  };

  if (!user) {
    return <div className="error">Nu ești autentificat</div>;
  }

  const displayAvatar = pendingAvatar || (user.avatar_url ? `http://localhost:3000${user.avatar_url}` : null);

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-card">
          <h1>Profil</h1>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="profile-section">
            <div className="avatar-section">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={user.name}
                  className="avatar"
                />
              ) : (
                <div className="avatar-placeholder">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                  id="avatar-input"
                />
                <label htmlFor="avatar-input" className="btn btn-secondary">
                  Schimbă Avatar
                </label>
              </div>
            </div>

            <div className="profile-info">
              <div className="form-group">
                <label htmlFor="profile-name">Nume *</label>
                <input
                  type="text"
                  id="profile-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  minLength={2}
                />
              </div>
              <div className="form-group">
                <label htmlFor="profile-username">Username</label>
                <input
                  type="text"
                  id="profile-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  pattern="[a-zA-Z0-9_]+"
                  minLength={3}
                  maxLength={30}
                  placeholder="ion_popescu"
                />
                <small>
                  Doar litere, cifre și underscore
                </small>
              </div>
              <div className="info-row">
                <strong>Email:</strong>
                <span>{user.email}</span>
              </div>
              <div className="info-row">
                <strong>Rol:</strong>
                <span className={user.role === 'admin' ? 'admin-role' : ''}>
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </span>
              </div>
            </div>
          </div>

          {hasChanges && (
            <div className="profile-actions">
              <button onClick={handleSaveChanges} className="btn btn-primary" disabled={loading}>
                {loading ? 'Salvare...' : 'Salvează Modificările'}
              </button>
              <button onClick={handleCancel} className="btn btn-secondary" disabled={loading}>
                Anulează
              </button>
            </div>
          )}

          <button onClick={logout} className="btn btn-danger" style={{ marginTop: '1rem', width: '100%' }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}