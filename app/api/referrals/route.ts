import { NextRequest, NextResponse } from 'next/server';
import { createReferral, getUserByEmail, getUserByReferralCode } from '@/lib/referral';

export async function POST(request: NextRequest) {
  try {
    const { referrerEmail, referredEmail, referralCode } = await request.json();

    if (!referredEmail || !referralCode) {
      return NextResponse.json(
        { error: 'Referred email and referral code are required' },
        { status: 400 }
      );
    }

    // Validate referral code
    const referrer = getUserByReferralCode(referralCode);
    if (!referrer) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 400 }
      );
    }

    // Don't allow self-referrals
    if (referrer.email === referredEmail) {
      return NextResponse.json(
        { error: 'Cannot refer yourself' },
        { status: 400 }
      );
    }

    // Create referral record
    createReferral(referrer.id, referredEmail, referralCode);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating referral:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
