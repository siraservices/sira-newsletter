import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '../../data');
const dbPath = join(dataDir, 'subscribers.db');

class SubscriberDatabase {
  constructor() {
    // Ensure data directory exists
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    
    // Create or open database
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  initializeDatabase() {
    // Create subscribers table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        token TEXT UNIQUE NOT NULL,
        subscribed INTEGER DEFAULT 1,
        subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        unsubscribed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_email ON subscribers(email);
      CREATE INDEX IF NOT EXISTS idx_token ON subscribers(token);
      CREATE INDEX IF NOT EXISTS idx_subscribed ON subscribers(subscribed);
    `);
  }

  // Generate a unique token for unsubscribe links
  generateToken(email) {
    return crypto.createHash('sha256')
      .update(email + Date.now() + Math.random())
      .digest('hex');
  }

  // Add a new subscriber
  addSubscriber(email) {
    try {
      const token = this.generateToken(email);
      const stmt = this.db.prepare(`
        INSERT INTO subscribers (email, token, subscribed)
        VALUES (?, ?, 1)
      `);
      const result = stmt.run(email, token);
      return { success: true, id: result.lastInsertRowid, token };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        // Email already exists, get the token
        const existing = this.getSubscriberByEmail(email);
        if (existing && !existing.subscribed) {
          // Resubscribe
          return this.resubscribe(email);
        }
        return { success: false, error: 'Email already subscribed' };
      }
      throw error;
    }
  }

  // Get subscriber by email
  getSubscriberByEmail(email) {
    const stmt = this.db.prepare('SELECT * FROM subscribers WHERE email = ?');
    return stmt.get(email);
  }

  // Get subscriber by token
  getSubscriberByToken(token) {
    const stmt = this.db.prepare('SELECT * FROM subscribers WHERE token = ?');
    return stmt.get(token);
  }

  // Unsubscribe a user
  unsubscribe(token) {
    const stmt = this.db.prepare(`
      UPDATE subscribers 
      SET subscribed = 0, 
          unsubscribed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE token = ? AND subscribed = 1
    `);
    const result = stmt.run(token);
    return { success: result.changes > 0 };
  }

  // Resubscribe a user
  resubscribe(email) {
    const stmt = this.db.prepare(`
      UPDATE subscribers 
      SET subscribed = 1, 
          unsubscribed_at = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
    `);
    const result = stmt.run(email);
    const subscriber = this.getSubscriberByEmail(email);
    return { success: result.changes > 0, token: subscriber?.token };
  }

  // Get all active subscribers
  getActiveSubscribers() {
    const stmt = this.db.prepare('SELECT * FROM subscribers WHERE subscribed = 1');
    return stmt.all();
  }

  // Get all active subscriber emails
  getActiveSubscriberEmails() {
    const stmt = this.db.prepare('SELECT email FROM subscribers WHERE subscribed = 1');
    return stmt.all().map(row => row.email);
  }

  // Get statistics
  getStats() {
    const stmt = this.db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN subscribed = 1 THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN subscribed = 0 THEN 1 ELSE 0 END) as unsubscribed
      FROM subscribers
    `);
    return stmt.get();
  }

  // Migrate existing recipients from config
  migrateFromConfig(emails) {
    const results = { added: 0, existing: 0, errors: [] };
    
    for (const email of emails) {
      try {
        const result = this.addSubscriber(email);
        if (result.success) {
          results.added++;
        } else {
          results.existing++;
        }
      } catch (error) {
        results.errors.push({ email, error: error.message });
      }
    }
    
    return results;
  }

  close() {
    this.db.close();
  }
}

// Export a singleton instance
const subscriberDB = new SubscriberDatabase();
export default subscriberDB;

