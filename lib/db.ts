import path from 'path';

let Database: any;
let db: any = null;
let dbError: Error | null = null;
let dbAvailable = false;

// Try to import better-sqlite3, but don't crash if it fails
try {
  Database = require('better-sqlite3');
  dbAvailable = true;
} catch (error) {
  console.warn('better-sqlite3 not available, database features will be limited:', error);
  dbAvailable = false;
}

const dbPath = path.join(process.cwd(), 'insurance.db');

function getDatabase() {
  if (!dbAvailable) {
    throw new Error('Database is not available. better-sqlite3 failed to load.');
  }
  
  if (dbError) {
    throw dbError;
  }
  
  if (!db) {
    try {
      db = new Database(dbPath);
      initDatabase();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      dbError = error as Error;
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

// Export a function that returns the database (truly lazy)
// This prevents database initialization on module import
export default function getDb() {
  try {
    return getDatabase();
  } catch (error) {
    console.error('Database unavailable:', error);
    // Return a mock database object that will fail gracefully
    throw new Error('Database is not available. Please check server logs.');
  }
}
