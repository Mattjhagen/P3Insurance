import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { completeReferral, getUserByReferralCode } from '@/lib/referral';

export async function POST(request: NextRequest) {
  try {
    const { userEmail, companyName, referralCode } = await request.json();

    if (!userEmail || !companyName) {
      return NextResponse.json(
        { error: 'User email and company name are required' },
        { status: 400 }
      );
    }

    // Save the signup
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO signups (user_email, company_name, referral_code, status)
      VALUES (?, ?, ?, 'completed')
    `);
    stmt.run(userEmail, companyName, referralCode || null);

    // If there's a referral code, complete the referral and award bonus
    if (referralCode) {
      const referrer = getUserByReferralCode(referralCode);
      if (referrer && referrer.email !== userEmail) {
        // Award $25 bonus
        completeReferral(referralCode, 25.0);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing signup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
