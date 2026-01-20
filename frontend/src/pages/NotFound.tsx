import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1 className="error-code">404</h1>
          <h2>Pagina nu a fost găsită</h2>
          <p>Scuze, pagina pe care o căutați nu există sau a fost mutată.</p>
          <Link to="/" className="btn btn-primary">
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    </div>
  );
}