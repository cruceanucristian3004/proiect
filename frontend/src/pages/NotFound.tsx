import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './NotFound.css';

export default function NotFound() {
  const { t } = useLanguage();
  
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1 className="error-code">404</h1>
          <h2>{t('notFound.title')}</h2>
          <p>{t('notFound.description')}</p>
          <Link to="/" className="btn btn-primary">
            {t('notFound.back')}
          </Link>
        </div>
      </div>
    </div>
  );
}