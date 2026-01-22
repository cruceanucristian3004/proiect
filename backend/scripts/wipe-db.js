import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function wipeDatabase() {
  try {
    console.log('⚠️  WARNING: This will DELETE ALL DATA from the database!');
    console.log('All tables will be dropped and recreated.\n');
    
    const confirm = await question('Are you sure you want to continue? (type "yes" to confirm): ');
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('Operation cancelled.');
      process.exit(0);
    }

    console.log('\nConnecting to database...');
    
    // Șterge toate tabelele în ordinea corectă (pentru a evita probleme cu foreign keys)
    console.log('Dropping all tables...');
    
    await pool.query(`
      DROP TABLE IF EXISTS files CASCADE;
      DROP TABLE IF EXISTS tasks CASCADE;
      DROP TABLE IF EXISTS articles CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    
    console.log('✅ All tables dropped successfully!');
    
    // Recrează schema
    console.log('Recreating schema...');
    const schemaPath = path.join(__dirname, '../src/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    
    console.log('✅ Database wiped and reinitialized successfully!');
    console.log('Tables created: users, products, articles, tasks, files');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error wiping database:', error.message);
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
    rl.close();
    await pool.end();
  }
}

wipeDatabase();
