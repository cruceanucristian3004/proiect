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

async function initDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Citește schema SQL
    const schemaPath = path.join(__dirname, '../src/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Creating tables...');
    
    // Rulează schema SQL
    await pool.query(schema);
    
    console.log('✅ Database initialized successfully!');
    console.log('Tables created: users, products, articles, tasks, files');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  PostgreSQL is not running or DATABASE_URL is incorrect.');
      console.error('Check your .env file and make sure PostgreSQL is started.');
    } else if (error.code === '28P01') {
      console.error('\n⚠️  Authentication failed. Check your DATABASE_URL credentials.');
    } else if (error.code === '3D000') {
      console.error('\n⚠️  Database does not exist. Create it first with:');
      console.error('   createdb -U your_user myapp');
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();