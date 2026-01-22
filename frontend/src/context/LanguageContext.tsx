import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ro' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ro: {
    // Navigation
    'nav.products': 'Produse',
    'nav.articles': 'Articole',
    'nav.profile': 'Profil',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin',
    
    // Home Page
    'home.subtitle': 'Platforma ta preferată pentru resells! Cumpără și vinde produse cu încredere. Descoperă cele mai bune oferte și gestionează-vânzările într-un mod simplu și eficient.',
    'home.cta.start': 'Începe acum',
    'home.stats.activeProducts': 'Produse Active',
    'home.stats.transactions': 'Tranzacții Finalizate',
    'home.stats.users': 'Utilizatori',
    'home.stats.uptime': '% Uptime',
    'home.features.title': 'Funcționalități Puternice',
    'home.features.subtitle': 'Toate instrumentele necesare pentru resells într-un singur loc',
    'home.features.secureAuth.title': 'Autentificare Securizată',
    'home.features.secureAuth.description': 'Sistem robust de autentificare cu JWT, hash bcrypt și roluri multiple. Protecție completă pentru datele tale.',
    'home.features.products.title': 'Resell Produse',
    'home.features.products.description': 'Publică produsele tale pentru resell cu imagini, prețuri și descrieri detaliate. Gestionează-ți inventarul și primește oferte de la cumpărători.',
    'home.features.products.link': 'Explorează produse →',
    'home.features.articles.title': 'Ghiduri Resells',
    'home.features.articles.description': 'Creează și citește ghiduri despre resells, sfaturi pentru vânzări și articole despre cele mai bune produse pentru revanzare.',
    'home.features.articles.link': 'Citește ghiduri →',
    'home.features.profile.title': 'Profil Personalizat',
    'home.features.profile.description': 'Gestionează-ți profilul, vezi tranzacțiile tale și personalizează-ți experiența pe platformă.',
    'home.features.profile.link': 'Vezi profilul →',
    'home.howItWorks.title': 'Cum Funcționează',
    'home.howItWorks.subtitle': 'În doar câteva pași simpli',
    'home.howItWorks.step1.title': 'Creează Cont',
    'home.howItWorks.step1.description': 'Înregistrează-te rapid cu email și parolă. Proces simplu și securizat.',
    'home.howItWorks.step2.title': 'Explorează Produse',
    'home.howItWorks.step2.description': 'Caută produse pentru resell sau publică propriile produse. Filtrează și compară oferte.',
    'home.howItWorks.step3.title': 'Cumpără sau Vinde',
    'home.howItWorks.step3.description': 'Alege produsele care te interesează sau publică-ți propriile produse pentru resell.',
    'home.howItWorks.step4.title': 'Gestionează Tranzacțiile',
    'home.howItWorks.step4.description': 'Urmărește-ți cumpărăturile și vânzările. Comunică cu cumpărătorii și vânzătorii.',
    'home.cta.final.title': 'Gata să Începi?',
    'home.cta.final.description': 'Alătură-te comunității Nova Resells și începe să cumperi sau să vinzi produse astăzi',
    'home.cta.final.create': 'Creează Cont Gratuit',
    'home.cta.final.login': 'Am deja cont',
    
    // Auth Pages
    'auth.login.title': 'Login',
    'auth.login.email': 'Email',
    'auth.login.password': 'Password',
    'auth.login.submit': 'Login',
    'auth.login.loading': 'Loading...',
    'auth.login.noAccount': 'Nu ai cont?',
    'auth.login.register': 'Înregistrează-te',
    'auth.login.error': 'Email sau parolă incorectă. Te rugăm să încerci din nou.',
    'auth.register.title': 'Înregistrare',
    'auth.register.name': 'Nume',
    'auth.register.username': 'Username (opțional)',
    'auth.register.email': 'Email',
    'auth.register.password': 'Password',
    'auth.register.submit': 'Înregistrează-te',
    'auth.register.loading': 'Loading...',
    'auth.register.hasAccount': 'Ai deja cont?',
    'auth.register.usernameHint': 'Doar litere, cifre și underscore',
    'auth.register.error': 'A apărut o eroare la înregistrare. Te rugăm să încerci din nou.',
    
    // Products
    'products.title': 'Produse',
    'products.add': '+ Adaugă Produs',
    'products.empty': 'Nu există produse încă.',
    'products.addFirst': 'Adaugă primul produs',
    'products.loading': 'Loading...',
    'products.deleteConfirm': 'Sigur vrei să ștergi acest produs?',
    'products.deleteError': 'Eroare la ștergere',
    'products.publishedBy': 'Publicat de',
    'products.edit': 'Editează',
    'products.delete': 'Șterge',
    'products.price': 'Preț',
    'products.back': '← Înapoi la Produse',
    'products.notFound': 'Produsul nu a fost găsit',
    'products.description': 'Descriere',
    'products.publishedOn': 'pe',
    
    // Articles
    'articles.title': 'Articole',
    'articles.add': '+ Scrie Articol',
    'articles.empty': 'Nu există articole încă.',
    'articles.addFirst': 'Scrie primul articol',
    'articles.loading': 'Loading...',
    'articles.deleteConfirm': 'Sigur vrei să ștergi acest articol?',
    'articles.deleteError': 'Eroare la ștergere',
    'articles.publishedBy': 'Publicat de',
    'articles.writtenBy': 'Scris de',
    'articles.readMore': 'Citește mai mult',
    'articles.edit': 'Editează',
    'articles.delete': 'Șterge',
    'articles.back': '← Înapoi la Articole',
    'articles.notFound': 'Articolul nu a fost găsit',
    'articles.publishedOn': 'pe',
    
    // Profile
    'profile.title': 'Profil',
    'profile.avatar.title': 'Avatar',
    'profile.avatar.change': 'Schimbă Avatar',
    'profile.avatar.choose': 'Alege imagine',
    'profile.avatar.error': 'Fișierul trebuie să fie o imagine',
    'profile.name': 'Nume',
    'profile.username': 'Username',
    'profile.email': 'Email',
    'profile.role': 'Rol',
    'profile.save': 'Salvează Modificările',
    'profile.cancel': 'Anulează',
    'profile.delete': 'Șterge Cont',
    'profile.deleteConfirm': 'Sigur vrei să ștergi contul? Această acțiune nu poate fi anulată.',
    'profile.loading': 'Loading...',
    'profile.error': 'Eroare la salvarea profilului',
    'profile.success': 'Profil actualizat cu succes!',
    'profile.notAuthenticated': 'Trebuie să fii autentificat pentru a accesa acest profil.',
    'profile.saving': 'Salvare...',
    'profile.usernameHint': 'Doar litere, cifre și underscore',
    'profile.role.user': 'User',
    'profile.role.admin': 'Admin',
    
    // Forms
    'form.name': 'Nume',
    'form.price': 'Preț',
    'form.description': 'Descriere',
    'form.image': 'Imagine',
    'form.title': 'Titlu',
    'form.content': 'Conținut',
    'form.submit': 'Salvează',
    'form.cancel': 'Anulează',
    'form.loading': 'Loading...',
    
    // Footer
    'footer.copyright': 'Toate drepturile rezervate.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Eroare',
    'common.success': 'Succes',
    'common.save': 'Salvează',
    'common.cancel': 'Anulează',
    'common.delete': 'Șterge',
    'common.edit': 'Editează',
    
    // NotFound
    'notFound.title': 'Pagina nu a fost găsită',
    'notFound.description': 'Scuze, pagina pe care o căutați nu există sau a fost mutată.',
    'notFound.back': 'Înapoi la pagina principală',
  },
  en: {
    // Navigation
    'nav.products': 'Products',
    'nav.articles': 'Articles',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin',
    
    // Home Page
    'home.subtitle': 'Your favorite platform for resells! Buy and sell products with confidence. Discover the best deals and manage your sales in a simple and efficient way.',
    'home.cta.start': 'Get Started',
    'home.stats.activeProducts': 'Active Products',
    'home.stats.transactions': 'Completed Transactions',
    'home.stats.users': 'Users',
    'home.stats.uptime': '% Uptime',
    'home.features.title': 'Powerful Features',
    'home.features.subtitle': 'All the tools you need for resells in one place',
    'home.features.secureAuth.title': 'Secure Authentication',
    'home.features.secureAuth.description': 'Robust authentication system with JWT, bcrypt hashing and multiple roles. Complete protection for your data.',
    'home.features.products.title': 'Resell Products',
    'home.features.products.description': 'Publish your products for resell with images, prices and detailed descriptions. Manage your inventory and receive offers from buyers.',
    'home.features.products.link': 'Explore products →',
    'home.features.articles.title': 'Resell Guides',
    'home.features.articles.description': 'Create and read guides about resells, sales tips and articles about the best products for resale.',
    'home.features.articles.link': 'Read guides →',
    'home.features.profile.title': 'Custom Profile',
    'home.features.profile.description': 'Manage your profile, view your transactions and customize your experience on the platform.',
    'home.features.profile.link': 'View profile →',
    'home.howItWorks.title': 'How It Works',
    'home.howItWorks.subtitle': 'In just a few simple steps',
    'home.howItWorks.step1.title': 'Create Account',
    'home.howItWorks.step1.description': 'Register quickly with email and password. Simple and secure process.',
    'home.howItWorks.step2.title': 'Explore Products',
    'home.howItWorks.step2.description': 'Search for products to resell or publish your own products. Filter and compare offers.',
    'home.howItWorks.step3.title': 'Buy or Sell',
    'home.howItWorks.step3.description': 'Choose the products that interest you or publish your own products for resale.',
    'home.howItWorks.step4.title': 'Manage Transactions',
    'home.howItWorks.step4.description': 'Track your purchases and sales. Communicate with buyers and sellers.',
    'home.cta.final.title': 'Ready to Start?',
    'home.cta.final.description': 'Join the Nova Resells community and start buying or selling products today',
    'home.cta.final.create': 'Create Free Account',
    'home.cta.final.login': 'I already have an account',
    
    // Auth Pages
    'auth.login.title': 'Login',
    'auth.login.email': 'Email',
    'auth.login.password': 'Password',
    'auth.login.submit': 'Login',
    'auth.login.loading': 'Loading...',
    'auth.login.noAccount': "Don't have an account?",
    'auth.login.register': 'Register',
    'auth.login.error': 'Incorrect email or password. Please try again.',
    'auth.register.title': 'Register',
    'auth.register.name': 'Name',
    'auth.register.username': 'Username (optional)',
    'auth.register.email': 'Email',
    'auth.register.password': 'Password',
    'auth.register.submit': 'Register',
    'auth.register.loading': 'Loading...',
    'auth.register.hasAccount': 'Already have an account?',
    'auth.register.usernameHint': 'Letters, numbers and underscore only',
    'auth.register.error': 'An error occurred during registration. Please try again.',
    
    // Products
    'products.title': 'Products',
    'products.add': '+ Add Product',
    'products.empty': 'No products yet.',
    'products.addFirst': 'Add first product',
    'products.loading': 'Loading...',
    'products.deleteConfirm': 'Are you sure you want to delete this product?',
    'products.deleteError': 'Error deleting product',
    'products.publishedBy': 'Published by',
    'products.edit': 'Edit',
    'products.delete': 'Delete',
    'products.price': 'Price',
    'products.back': '← Back to Products',
    'products.notFound': 'Product not found',
    'products.description': 'Description',
    'products.publishedOn': 'on',
    
    // Articles
    'articles.title': 'Articles',
    'articles.add': '+ Write Article',
    'articles.empty': 'No articles yet.',
    'articles.addFirst': 'Write first article',
    'articles.loading': 'Loading...',
    'articles.deleteConfirm': 'Are you sure you want to delete this article?',
    'articles.deleteError': 'Error deleting article',
    'articles.publishedBy': 'Published by',
    'articles.writtenBy': 'Written by',
    'articles.readMore': 'Read more',
    'articles.edit': 'Edit',
    'articles.delete': 'Delete',
    'articles.back': '← Back to Articles',
    'articles.notFound': 'Article not found',
    'articles.publishedOn': 'on',
    
    // Profile
    'profile.title': 'Profile',
    'profile.avatar.title': 'Avatar',
    'profile.avatar.change': 'Change Avatar',
    'profile.avatar.choose': 'Choose image',
    'profile.avatar.error': 'File must be an image',
    'profile.name': 'Name',
    'profile.username': 'Username',
    'profile.email': 'Email',
    'profile.role': 'Role',
    'profile.save': 'Save Changes',
    'profile.cancel': 'Cancel',
    'profile.delete': 'Delete Account',
    'profile.deleteConfirm': 'Are you sure you want to delete your account? This action cannot be undone.',
    'profile.loading': 'Loading...',
    'profile.error': 'Error saving profile',
    'profile.success': 'Profile updated successfully!',
    'profile.notAuthenticated': 'You must be authenticated to access this profile.',
    'profile.saving': 'Saving...',
    'profile.usernameHint': 'Letters, numbers and underscore only',
    'profile.role.user': 'User',
    'profile.role.admin': 'Admin',
    
    // Forms
    'form.name': 'Name',
    'form.price': 'Price',
    'form.description': 'Description',
    'form.image': 'Image',
    'form.title': 'Title',
    'form.content': 'Content',
    'form.submit': 'Save',
    'form.cancel': 'Cancel',
    'form.loading': 'Loading...',
    
    // Footer
    'footer.copyright': 'All rights reserved.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    
    // NotFound
    'notFound.title': 'Page Not Found',
    'notFound.description': 'Sorry, the page you are looking for does not exist or has been moved.',
    'notFound.back': 'Back to Home',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'ro' || saved === 'en') ? saved : 'ro';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ro] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
