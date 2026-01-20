# Setup Backend - PostgreSQL Configuration

## Problema identificată
Aplicația nu se poate conecta la PostgreSQL. Eroarea `ECONNREFUSED` înseamnă că PostgreSQL nu rulează sau nu este configurat corect.

## Pași pentru rezolvare

### 1. Instalare PostgreSQL (dacă nu este instalat)

**Pe Arch Linux / CachyOS:**
```bash
sudo pacman -S postgresql
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

**Pe Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Pe Fedora:**
```bash
sudo dnf install postgresql-server postgresql
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Crearea bazei de date și a utilizatorului

```bash
# Conectează-te ca utilizator postgres
sudo -u postgres psql

# În psql, rulează:
CREATE DATABASE myapp;
CREATE USER myappuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE myapp TO myappuser;
\q
```

### 3. Rularea schema SQL

```bash
sudo -u postgres psql -d myapp -f src/db/schema.sql
```

SAU, dacă folosești utilizatorul creat:

```bash
psql -U myappuser -d myapp -h localhost -f src/db/schema.sql
```

### 4. Crearea fișierului .env

Creează un fișier `.env` în folderul `backend/` cu următorul conținut:

```env
PORT=3000
DATABASE_URL=postgresql://myappuser:your_password@localhost:5432/myapp
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
UPLOAD_DIR=./uploads
NODE_ENV=development
```

**IMPORTANT:** Înlocuiește `your_password` cu parola reală setată la pasul 2.

### 5. Verificarea conexiunii

```bash
# Verifică dacă PostgreSQL rulează
sudo systemctl status postgresql

# Testează conexiunea
psql -U myappuser -d myapp -h localhost
```

După ce ai configurat toate astea, pornește din nou serverul backend:
```bash
cd backend
npm run dev
```

## Soluție rapidă (pentru testare locală)

Dacă vrei doar să testezi aplicația rapid, poți folosi o bază de date SQLite temporară sau Docker:

### Opțiunea Docker (cel mai simplu):
```bash
docker run --name postgres-myapp -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=myapp -p 5432:5432 -d postgres
```

Apoi în `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp
```