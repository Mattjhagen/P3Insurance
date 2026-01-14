import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getReferralsByUserId, getTotalBonusByUserId } from '@/lib/referral';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json({
        referrals: [],
        totalBonus: 0,
        referralCode: '',
      });
    }

    const referrals = getReferralsByUserId(user.id);
    const totalBonus = getTotalBonusByUserId(user.id);

    return NextResponse.json({
      referrals,
      totalBonus,
      referralCode: user.referral_code,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
