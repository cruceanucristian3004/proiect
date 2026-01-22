import pg from 'pg';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

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

async function setAdmin() {
  try {
    console.log('🔐 Set Admin User\n');
    
    const email = await question('Enter user email: ');
    
    if (!email) {
      console.error('❌ Email is required!');
      process.exit(1);
    }

    // Verifică dacă utilizatorul există
    const checkUser = await pool.query(
      'SELECT id, email, name, role FROM users WHERE email = $1',
      [email]
    );

    if (checkUser.rows.length === 0) {
      console.error(`❌ User with email "${email}" not found!`);
      process.exit(1);
    }

    const user = checkUser.rows[0];
    console.log(`\nFound user: ${user.name} (${user.email})`);
    console.log(`Current role: ${user.role}`);

    if (user.role === 'admin') {
      console.log('⚠️  User is already an admin!');
      const confirm = await question('\nDo you want to remove admin role? (yes/no): ');
      if (confirm.toLowerCase() === 'yes') {
        await pool.query(
          'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2',
          ['user', email]
        );
        console.log('✅ Admin role removed successfully!');
      } else {
        console.log('Operation cancelled.');
      }
    } else {
      const confirm = await question('\nSet this user as admin? (yes/no): ');
      if (confirm.toLowerCase() === 'yes') {
        await pool.query(
          'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2',
          ['admin', email]
        );
        console.log('✅ User set as admin successfully!');
      } else {
        console.log('Operation cancelled.');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  PostgreSQL is not running or DATABASE_URL is incorrect.');
    } else if (error.code === '28P01') {
      console.error('\n⚠️  Authentication failed. Check your DATABASE_URL credentials.');
    }
    process.exit(1);
  } finally {
    rl.close();
    await pool.end();
  }
}

setAdmin();
