import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  try {
    console.log('🔄 Running migration: Add username column\n');
    console.log('Connecting to database...');
    
    // Citește migrarea SQL
    const migrationPath = path.join(__dirname, '../src/db/migration-add-username.sql');
    const migration = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Executing migration...');
    
    // Rulează migrarea SQL
    await pool.query(migration);
    
    console.log('✅ Migration completed successfully!');
    console.log('Username column added to users table.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running migration:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  PostgreSQL is not running or DATABASE_URL is incorrect.');
      console.error('Check your .env file and make sure PostgreSQL is started.');
    } else if (error.code === '28P01') {
      console.error('\n⚠️  Authentication failed. Check your DATABASE_URL credentials.');
    } else if (error.code === '42703') {
      console.error('\n⚠️  Column might already exist. This is OK if you already ran the migration.');
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
