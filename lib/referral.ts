import { v4 as uuidv4 } from 'uuid';
import getDb from './db';

export function generateReferralCode(): string {
  return uuidv4().substring(0, 8).toUpperCase();
}

export function createUser(email: string): { id: number; referralCode: string } {
  const db = getDb();
  const referralCode = generateReferralCode();
  
  const stmt = db.prepare('INSERT INTO users (email, referral_code) VALUES (?, ?)');
  const result = stmt.run(email, referralCode);
  
  return {
    id: Number(result.lastInsertRowid),
    referralCode,
  };
}

export function getUserByEmail(email: string) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as { id: number; email: string; referral_code: string; created_at: string } | undefined;
}

export function getUserByReferralCode(referralCode: string) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM users WHERE referral_code = ?');
  return stmt.get(referralCode) as { id: number; email: string; referral_code: string; created_at: string } | undefined;
}

export function createReferral(referrerId: number, referredEmail: string, referralCode: string) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO referrals (referrer_id, referred_email, referral_code, status)
    VALUES (?, ?, ?, 'pending')
  `);
  return stmt.run(referrerId, referredEmail, referralCode);
}

export function completeReferral(referralCode: string, bonusAmount: number = 25.0) {
  const db = getDb();
  const stmt = db.prepare(`
    UPDATE referrals 
    SET status = 'completed', bonus_amount = ?, completed_at = CURRENT_TIMESTAMP
    WHERE referral_code = ? AND status = 'pending'
  `);
  return stmt.run(bonusAmount, referralCode);
}

export function getReferralsByUserId(userId: number) {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM referrals WHERE referrer_id = ? ORDER BY created_at DESC
  `);
  return stmt.all(userId) as Array<{
    id: number;
    referrer_id: number;
    referred_email: string;
    referral_code: string;
    status: string;
    bonus_amount: number;
    created_at: string;
    completed_at: string | null;
  }>;
}

export function getTotalBonusByUserId(userId: number): number {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT SUM(bonus_amount) as total FROM referrals 
    WHERE referrer_id = ? AND status = 'completed'
  `);
  const result = stmt.get(userId) as { total: number | null };
  return result.total || 0;
}
