import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const LOG_FILE = path.join(process.cwd(), '.cursor', 'debug.log');
const log = (data: any) => {
  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(LOG_FILE, JSON.stringify(data) + '\n');
  } catch {}
};

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
  // #region agent log
  log({location:'backend/src/db/connection.ts:24',message:'PostgreSQL connection established',data:{hasConnectionString:!!process.env.DATABASE_URL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
  // #endregion
});

pool.on('error', (err: Error & { code?: string }) => {
  console.error('Unexpected error on idle client', err);
  // #region agent log
  log({location:'backend/src/db/connection.ts:30',message:'PostgreSQL connection error',data:{error:err.message,code:err.code},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
  // #endregion
  process.exit(-1);
});