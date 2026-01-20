import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef } from 'react';
import './Home.css';

// Counter animation for stats
const animateCounter = (element: HTMLElement, target: number) => {
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;
  
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current).toString();
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toString();
    }
  };
  
  updateCounter();
};

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Animate counters in stats section
          if (entry.target.classList.contains('stats-section')) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach((counter) => {
              const target = parseInt(counter.getAttribute('data-count') || '0');
              animateCounter(counter as HTMLElement, target);
            });
          }
        }
      });
    }, observerOptions);

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const setRef = (index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero">
            <h1 className="hero-title">
              <span className="gradient-text">Nova Resells</span>
            </h1>
            <p className="hero-subtitle">
              Platforma ta preferată pentru resells! Cumpără și vinde produse cu încredere. 
              Descoperă cele mai bune oferte și gestionează-vânzările într-un mod simplu și eficient.
            </p>
            {!isAuthenticated && (
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary">
                  Începe acum
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={setRef(0)} className="stats-section scroll-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🚀</div>
              <div className="stat-number" data-count="100">0</div>
              <div className="stat-label">Produse Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-number" data-count="500">0</div>
              <div className="stat-label">Tranzacții Finalizate</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-number" data-count="1000">0</div>
              <div className="stat-label">Utilizatori</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-number" data-count="99">0</div>
              <div className="stat-label">% Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={setRef(1)} className="features-section scroll-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Funcționalități Puternice</h2>
            <p className="section-subtitle">
              Toate instrumentele necesare pentru resells într-un singur loc
            </p>
          </div>
          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h2>Autentificare Securizată</h2>
              <p>
                Sistem robust de autentificare cu JWT, hash bcrypt și roluri multiple. 
                Protecție completă pentru datele tale.
              </p>
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Începe acum
                </Link>
              )}
            </div>
            <Link to="/products" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon">📦</div>
              <h2>Resell Produse</h2>
              <p>
                Publică produsele tale pentru resell cu imagini, prețuri și descrieri detaliate. 
                Gestionează-ți inventarul și primește oferte de la cumpărători.
              </p>
              <div className="feature-link">Explorează produse →</div>
            </Link>
            <Link to="/articles" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon">📝</div>
              <h2>Ghiduri Resells</h2>
              <p>
                Creează și citește ghiduri despre resells, sfaturi pentru vânzări și articole despre 
                cele mai bune produse pentru revanzare.
              </p>
              <div className="feature-link">Citește ghiduri →</div>
            </Link>
            {isAuthenticated && (
              <Link to="/profile" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="feature-icon">📁</div>
                <h2>Profil Personalizat</h2>
                <p>
                  Personalizează profilul tău cu avatar, username și informații personale. 
                  Upload simplu și rapid.
                </p>
                <div className="feature-link">Vezi profil →</div>
              </Link>
            )}
            {isAdmin && (
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h2>Securitate Avansată</h2>
                <p>
                  Validare Zod, sanitizare SQL, protecție XSS și SQL injection. 
                  Aplicație sigură de la bază.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={setRef(2)} className="how-it-works-section scroll-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Cum Funcționează</h2>
            <p className="section-subtitle">
              În doar câteva pași simpli
            </p>
          </div>
          <div className="steps">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Creează Cont</h3>
              <p>
                Înregistrează-te rapid cu email și parolă. Proces simplu și securizat.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Explorează Produse</h3>
              <p>
                Caută produse pentru resell sau publică propriile produse. Filtrează și compară oferte.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Cumpără sau Vinde</h3>
              <p>
                Alege produsele care te interesează sau publică-ți propriile produse pentru resell.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">04</div>
              <h3>Gestionează Tranzacțiile</h3>
              <p>
                Urmărește-ți cumpărăturile și vânzările. Comunică cu cumpărătorii și vânzătorii.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      {!isAuthenticated && (
        <section ref={setRef(3)} className="cta-section scroll-section">
          <div className="container">
            <div className="cta-content">
              <h2>Gata să Începi?</h2>
              <p>
                Alătură-te comunității Nova Resells și începe să cumperi sau să vinzi produse astăzi
              </p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary btn-large">
                  Creează Cont Gratuit
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  Am deja cont
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}