# Backend - Hono API

Backend API construit cu Hono, PostgreSQL si TypeScript.

## Instalare

```bash
npm install
```

## Configurare

1. Creeaza fisierul `.env`:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
JWT_SECRET=your-super-secret-jwt-key
UPLOAD_DIR=./uploads
NODE_ENV=development
```

2. Creeaza baza de date si ruleaza schema:
```bash
psql -U your_user -d your_database -f src/db/schema.sql
```

## Rulare

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```