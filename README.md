# Full Stack Application

Aplicatie full-stack completa cu React (frontend) si Hono (backend), PostgreSQL ca baza de date.

## Cerinte implementate

✅ **Auth**: Register, Login, Logout  
✅ **Roluri**: User normal + Admin (adminul poate sterge/edita orice)  
✅ **CRUD**: 3 tabele (produse, articole, task-uri)  
✅ **Fisiere**: Upload poză/avatar/document cu salvare pe disc  
✅ **Validare & sanitizare**: Fără SQL-injection, XSS (folosind Zod pentru validare)  
✅ **Rutare curata**: `site.com/produs/42`, nu `produs.php?id=42`  
✅ **Templating**: Separat de logica (componente React)  
✅ **404 & handled errors**: Pagini frumoase pentru erori  

## Structura Proiectului

```
proiecte/
├── bakcend/          # Backend Hono API
│   ├── src/
│   │   ├── auth/     # Handlers pentru autentificare
│   │   ├── db/       # Conexiune PostgreSQL si schema
│   │   ├── middlewares/  # Auth middleware, error handler
│   │   ├── modules/  # Handlers pentru CRUD (produse, articole, tasks)
│   │   └── utils/    # JWT, hash password, upload files
│   └── package.json
│
└── frontend/         # Frontend React
    ├── src/
    │   ├── api/      # API client si servicii
    │   ├── components/
    │   ├── context/  # Auth context
    │   ├── hooks/    # Custom hooks
    │   ├── layouts/  # Layout component
    │   └── pages/    # Pagini (Home, Login, Products, etc.)
    └── package.json
```

## Setup

### Backend

1. Instaleaza dependintele:
```bash
cd bakcend
npm install
```

2. Configuraza PostgreSQL:
   - Creeaza o baza de date PostgreSQL
   - Ruleaza schema SQL pentru a crea tabelele:
   ```bash
   psql -U your_user -d your_database -f src/db/schema.sql
   ```

3. Configuraza variabilele de mediu:
   - Creeaza un fisier `.env` in folderul `bakcend/`
   - Copiaza continutul din `.env.example` si modifica valorile:
   ```
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/myapp
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   UPLOAD_DIR=./uploads
   NODE_ENV=development
   ```

4. Porneste serverul:
```bash
npm run dev
```

Serverul va rula pe `http://localhost:3000`

### Frontend

1. Instaleaza dependintele:
```bash
cd frontend
npm install
```

2. Porneste development server:
```bash
npm run dev
```

Aplicatia va rula pe `http://localhost:5173`

## Utilizare

### Crearea unui cont admin

Pentru a crea un cont admin, poti modifica direct in baza de date:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### API Endpoints

#### Auth
- `POST /api/auth/register` - Inregistrare
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Profil utilizator (necesita auth)
- `POST /api/auth/avatar` - Upload avatar (necesita auth)

#### Products
- `GET /api/products` - Lista produse
- `GET /api/products/:id` - Detalii produs
- `POST /api/products` - Creare produs (necesita auth)
- `PUT /api/products/:id` - Update produs (necesita auth, owner sau admin)
- `DELETE /api/products/:id` - Sterge produs (necesita auth, owner sau admin)

#### Articles
- `GET /api/articles` - Lista articole
- `GET /api/articles/:id` - Detalii articol
- `POST /api/articles` - Creare articol (necesita auth)
- `PUT /api/articles/:id` - Update articol (necesita auth, owner sau admin)
- `DELETE /api/articles/:id` - Sterge articol (necesita auth, owner sau admin)

#### Tasks
- `GET /api/tasks` - Lista task-uri (necesita auth, userii vad doar ale lor, adminii vad toate)
- `GET /api/tasks/:id` - Detalii task (necesita auth)
- `POST /api/tasks` - Creare task (necesita auth)
- `PUT /api/tasks/:id` - Update task (necesita auth, owner sau admin)
- `DELETE /api/tasks/:id` - Sterge task (necesita auth, owner sau admin)

## Tehnologii

### Backend
- **Hono** - Framework web rapid
- **PostgreSQL** - Baza de date relationala
- **JWT** - Autentificare
- **bcryptjs** - Hash parole
- **Zod** - Validare si sanitizare
- **TypeScript** - Type safety

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **TypeScript** - Type safety
- **Vite** - Build tool

## Securitate

- Parolele sunt hash-uite cu bcrypt
- JWT pentru autentificare
- Validare pe backend cu Zod (previne SQL injection si XSS)
- Parametrii SQL folosesc prepared statements (pg)
- CORS configurat pentru frontend
- Error handling centralizat

## Note

- Fisierele upload-ate sunt salvate local in folderul `uploads/`
- Pentru productie, recomand sa folosesti S3 sau alt serviciu cloud pentru storage
- Modifica `JWT_SECRET` cu o valoare aleatoare sigura in productie