# Docker Setup pentru Nova Resells

Acest ghid te ajută să rulezi aplicația Nova Resells folosind Docker Compose, perfect pentru prezentare la facultate!

## Cerințe

- Docker instalat ([Download Docker](https://www.docker.com/get-started))
- Docker Compose (inclus în Docker Desktop)

## Rulare Rapidă

1. **Clonează repository-ul** (dacă nu l-ai făcut deja):
```bash
git clone https://github.com/AntraXPastiluta/proiect-webapp.git
cd proiect-webapp
```

2. **Pornește toate serviciile cu Docker Compose**:
```bash
docker-compose up --build
```

3. **Accesează aplicația**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - PostgreSQL: localhost:5432

## Ce include Docker Compose

### Servicii:

1. **PostgreSQL** (`postgres`)
   - Baza de date PostgreSQL 16
   - Se inițializează automat cu schema SQL
   - Datele sunt persistate într-un volume Docker

2. **Backend** (`backend`)
   - API Hono cu TypeScript
   - Se conectează automat la PostgreSQL
   - Port: 3000

3. **Frontend** (`frontend`)
   - Aplicație React cu Vite
   - Se conectează automat la backend
   - Port: 5173

## Comenzi Utile

### Pornire
```bash
# Pornește toate serviciile
docker-compose up

# Pornește în background
docker-compose up -d

# Rebuild și pornire
docker-compose up --build
```

### Oprire
```bash
# Oprește serviciile
docker-compose down

# Oprește și șterge volume-urile (ATENȚIE: șterge datele!)
docker-compose down -v
```

### Logs
```bash
# Vezi logs pentru toate serviciile
docker-compose logs

# Logs pentru un serviciu specific
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Logs în timp real
docker-compose logs -f
```

### Status
```bash
# Vezi statusul serviciilor
docker-compose ps

# Verifică health checks
docker-compose ps
```

## Structura Docker

```
proiect-webapp/
├── docker-compose.yml      # Configurație principală Docker Compose
├── backend/
│   ├── Dockerfile          # Image pentru backend
│   └── .dockerignore       # Fișiere excluse din build
├── frontend/
│   ├── Dockerfile          # Image pentru frontend
│   └── .dockerignore       # Fișiere excluse din build
└── .dockerignore           # Excluderi globale
```

## Variabile de Mediu

Variabilele sunt configurate în `docker-compose.yml`:

**Backend:**
- `DATABASE_URL`: postgresql://myappuser:134Zxdfgh@postgres:5432/myapp
- `JWT_SECRET`: your-super-secret-jwt-key-change-this-in-production
- `UPLOAD_DIR`: ./uploads
- `PORT`: 3000

**PostgreSQL:**
- `POSTGRES_USER`: myappuser
- `POSTGRES_PASSWORD`: 134Zxdfgh
- `POSTGRES_DB`: myapp

## Inițializare Baza de Date

Baza de date se inițializează automat când containerul PostgreSQL pornește pentru prima dată:
- Rulează `schema.sql` pentru a crea tabelele
- Rulează `migration-add-username.sql` pentru a adăuga câmpul username

## Persistența Datelor

- **PostgreSQL**: Datele sunt salvate în volume Docker `postgres_data`
- **Uploads**: Fișierele upload-ate sunt salvate în `backend/uploads/` (persistate prin volume)

## Troubleshooting

### Port deja folosit
Dacă porturile 3000, 5173 sau 5432 sunt deja folosite:
```bash
# Modifică porturile în docker-compose.yml
ports:
  - "3001:3000"  # Backend pe alt port
  - "5174:5173"  # Frontend pe alt port
```

### Rebuild complet
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Verifică conectivitatea
```bash
# Verifică dacă backend-ul răspunde
curl http://localhost:3000/api/health

# Verifică conexiunea la PostgreSQL
docker-compose exec postgres psql -U myappuser -d myapp -c "SELECT 1;"
```

### Logs pentru debugging
```bash
# Vezi toate logs-urile
docker-compose logs --tail=100

# Logs pentru un serviciu specific
docker-compose logs backend --tail=50 -f
```

## Pentru Prezentare

1. **Înainte de prezentare**:
   ```bash
   docker-compose up --build
   ```
   Așteaptă până când toate serviciile sunt "healthy"

2. **În timpul prezentării**:
   - Deschide http://localhost:5173 în browser
   - Toate funcționalitățile ar trebui să funcționeze

3. **După prezentare**:
   ```bash
   docker-compose down
   ```

## Note Importante

- Prima rulare poate dura mai mult (download images, build, etc.)
- Asigură-te că ai Docker Desktop pornit
- Dacă schimbi codul, rebuild: `docker-compose up --build`
- Pentru development rapid, poți folosi volume mounts (deja configurate)

## Suport

Dacă întâmpini probleme:
1. Verifică logs: `docker-compose logs`
2. Verifică status: `docker-compose ps`
3. Rebuild: `docker-compose up --build --force-recreate`
