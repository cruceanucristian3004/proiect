import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useEffect, useRef, useState } from 'react';
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
  const { t } = useLanguage();
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);

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

  // Scroll handler pentru animația textului și detectarea sfârșitului paginii
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Verifică dacă utilizatorul este aproape de finalul paginii
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (currentScrollY + windowHeight) / documentHeight;
      
      // Activează animația când utilizatorul ajunge la 95% din pagină
      if (scrollPercentage >= 0.95) {
        setIsScrolledToBottom(true);
      } else {
        setIsScrolledToBottom(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Verifică poziția inițială

    return () => {
      window.removeEventListener('scroll', handleScroll);
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
              <span className={`graffiti-text ${isScrolledToBottom ? 'hidden' : ''}`}>
                <span className="graffiti-word graffiti-nova">NOVA</span>
                <span className="graffiti-word graffiti-resells">RESELLS</span>
              </span>
            </h1>
            <p className="hero-slogan">
              Hard to find, easy to flex
            </p>
            <p className="hero-subtitle">
              {t('home.subtitle')}
            </p>
            {!isAuthenticated && (
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary">
                  {t('home.cta.start')}
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  {t('nav.login')}
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
              <div className="stat-label">{t('home.stats.activeProducts')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-number" data-count="500">0</div>
              <div className="stat-label">{t('home.stats.transactions')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-number" data-count="1000">0</div>
              <div className="stat-label">{t('home.stats.users')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-number" data-count="99">0</div>
              <div className="stat-label">{t('home.stats.uptime')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={setRef(1)} className="features-section scroll-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('home.features.title')}</h2>
            <p className="section-subtitle">
              {t('home.features.subtitle')}
            </p>
          </div>
          <div className="features">
            {!isAuthenticated && (
              <div className="feature-card">
                <div className="feature-icon">🔐</div>
                <h2>{t('home.features.secureAuth.title')}</h2>
                <p>
                  {t('home.features.secureAuth.description')}
                </p>
                <Link to="/register" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  {t('home.cta.start')}
                </Link>
              </div>
            )}
            <Link to="/products" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon">📦</div>
              <h2>{t('home.features.products.title')}</h2>
              <p>
                {t('home.features.products.description')}
              </p>
              <div className="feature-link">{t('home.features.products.link')}</div>
            </Link>
            <Link to="/articles" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon">📝</div>
              <h2>{t('home.features.articles.title')}</h2>
              <p>
                {t('home.features.articles.description')}
              </p>
              <div className="feature-link">{t('home.features.articles.link')}</div>
            </Link>
            {isAuthenticated && (
              <Link to="/profile" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="feature-icon">📁</div>
                <h2>{t('home.features.profile.title')}</h2>
                <p>
                  {t('home.features.profile.description')}
                </p>
                <div className="feature-link">{t('home.features.profile.link')}</div>
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
            <h2 className="section-title">{t('home.howItWorks.title')}</h2>
            <p className="section-subtitle">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>
          <div className="steps">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>{t('home.howItWorks.step1.title')}</h3>
              <p>
                {t('home.howItWorks.step1.description')}
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>{t('home.howItWorks.step2.title')}</h3>
              <p>
                {t('home.howItWorks.step2.description')}
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>{t('home.howItWorks.step3.title')}</h3>
              <p>
                {t('home.howItWorks.step3.description')}
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">04</div>
              <h3>{t('home.howItWorks.step4.title')}</h3>
              <p>
                {t('home.howItWorks.step4.description')}
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
              <h2>{t('home.cta.final.title')}</h2>
              <p>
                {t('home.cta.final.description')}
              </p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary btn-large">
                  {t('home.cta.final.create')}
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  {t('home.cta.final.login')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer with merged text animation */}
      <footer ref={footerRef} className="footer-section">
        <div className="container">
          <div className={`footer-graffiti-text ${isScrolledToBottom ? 'active' : ''}`}>
            <span className="footer-graffiti-word footer-nova">NOVA</span>
            <span className="footer-graffiti-word footer-resells">RESELLS</span>
            <span className="footer-graffiti-word footer-merged">Nova Resells</span>
          </div>
        </div>
      </footer>
    </div>
  );
}