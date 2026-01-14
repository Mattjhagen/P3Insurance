# P3Insurance - Car Insurance Comparison Platform

A modern web application for comparing car insurance quotes from multiple companies with a built-in referral bonus system.

## Features

- **Insurance Comparison**: Compare quotes from 6+ top insurance companies
- **Referral System**: Earn $25 for each friend who signs up using your referral code
- **Dashboard**: Track your referrals and earnings
- **Modern UI**: Beautiful, responsive design built with Next.js and Tailwind CSS
- **Real-time Tracking**: Monitor pending and completed referrals

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

1. **Compare Insurance**: Browse and compare quotes from different insurance companies
2. **Get Your Referral Code**: Enter your email to receive a unique referral code
3. **Share & Earn**: Share your referral code or link with friends
4. **Track Earnings**: Monitor your referrals and bonuses in the dashboard

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **SQLite**: Lightweight database for storing referrals and quotes
- **Lucide React**: Beautiful icon library

## Project Structure

```
P3Insurance/
├── app/
│   ├── api/          # API routes
│   ├── page.tsx      # Main page
│   └── layout.tsx    # Root layout
├── components/       # React components
├── lib/             # Database and utility functions
└── public/          # Static assets
```

## API Endpoints

- `POST /api/users` - Create or get user with referral code
- `POST /api/signups` - Record insurance signup and process referral
- `GET /api/dashboard` - Get user's referral stats
- `POST /api/referrals` - Create a new referral

## Notes

- This is a demo application with mock insurance data
- In production, you would integrate with real insurance APIs
- The referral bonus system is fully functional and tracks all referrals
- Database is stored in `insurance.db` (SQLite)

## License

MIT
