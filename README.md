# 🚀 Nova - Resell Marketplace

**Nova** este o platformă full-stack completă dedicată comunității de resell. Aplicația permite utilizatorilor să listeze produse, să posteze articole și să își gestioneze activitatea de vânzare, oferind în același timp un control total administratorilor pentru moderarea conținutului.

---

### 🛠️ Tehnologii Utilizate

Aplicația este construită pe un stack modern, punând accent pe viteză, securitate și tipizare strictă.

**Backend:**
* **Hono** – Framework web rapid și minimalist.
* **PostgreSQL** – Bază de date relațională pentru stocarea datelor.
* **JWT & bcryptjs** – Autentificare securizată și hashing pentru parole.
* **Zod** – Validare și sanitizare pentru prevenirea SQL injection și XSS.

**Frontend:**
* **React** – Librărie UI pentru interfață.
* **TypeScript** – Pentru siguranța tipurilor de date (Type safety).
* **Vite** – Instrument de build și development server.
* **Axios** – Client HTTP pentru comunicarea cu API-ul.

---

### 📂 Structura Proiectului

Proiectul este organizat modular pentru a separa clar logica de backend de interfața utilizatorului:

```text
proiecte/
├── backend/          # API-ul aplicației (Hono)
│   ├── src/
│   │   ├── auth/     # Login, Register și gestionare profil
│   │   ├── db/       # Schema PostgreSQL și conexiuni
│   │   ├── modules/  # CRUD: Produse, Articole, Task-uri
│   │   └── utils/    # JWT, Upload fișiere și Validări
│
└── frontend/         # Interfața utilizator (React)
    ├── src/
    │   ├── api/      # Servicii pentru apeluri API
    │   ├── context/  # Gestiunea stării globale (Auth)
    │   ├── pages/    # Pagini: Home, Shop, Admin, Login
    │   └── layouts/  # Structura vizuală a paginilor