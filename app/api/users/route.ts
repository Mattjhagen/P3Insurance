import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/referral';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = getUserByEmail(email);
    
    if (!user) {
      // Create new user
      const newUser = createUser(email);
      return NextResponse.json({
        id: newUser.id,
        email,
        referralCode: newUser.referralCode,
      });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      referralCode: user.referral_code,
    });
  } catch (error) {
    console.error('Error creating/getting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
