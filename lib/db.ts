import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'insurance.db');

let db: Database.Database | null = null;

function getDatabase(): Database.Database {
  if (!db) {
    try {
      db = new Database(dbPath);
      initDatabase();
    } catch (error) {
      console.error('Database initialization error:', error);
      // Re-throw to prevent silent failures
      throw error;
    }
  }
  return db;
}

// Initialize database tables
function initDatabase() {
  if (!db) return;
  
  try {
    // Users table (for referral tracking)
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        referral_code TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Referrals table (tracks who referred whom)
    db.exec(`
      CREATE TABLE IF NOT EXISTS referrals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referrer_id INTEGER NOT NULL,
        referred_email TEXT NOT NULL,
        referral_code TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        bonus_amount REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY (referrer_id) REFERENCES users(id)
      )
    `);

    // Quotes table (stores insurance quotes)
    db.exec(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT,
        company_name TEXT NOT NULL,
        monthly_premium REAL NOT NULL,
        annual_premium REAL NOT NULL,
        coverage_details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Signups table (tracks actual signups)
    db.exec(`
      CREATE TABLE IF NOT EXISTS signups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        company_name TEXT NOT NULL,
        referral_code TEXT,
        quote_id INTEGER,
        status TEXT DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quote_id) REFERENCES quotes(id)
      )
    `);
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
}

// Export the database instance (lazy initialization)
export default getDatabase();
