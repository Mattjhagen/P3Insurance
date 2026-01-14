'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Star, TrendingDown, Gift, Share2 } from 'lucide-react';
import InsuranceCard from '@/components/InsuranceCard';
import ReferralModal from '@/components/ReferralModal';
import Dashboard from '@/components/Dashboard';
import { getInsuranceQuotes, InsuranceQuote } from '@/lib/insurance';

export default function HomeClient() {
  const searchParams = useSearchParams();
  const [quotes, setQuotes] = useState<InsuranceQuote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<InsuranceQuote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name'>('price');
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralCodeFromUrl, setReferralCodeFromUrl] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // Check for referral code in URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCodeFromUrl(refCode);
      // Store in localStorage to use when user signs up
      localStorage.setItem('referralCode', refCode);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadedQuotes = getInsuranceQuotes({ sortBy });
    setQuotes(loadedQuotes);
    setFilteredQuotes(loadedQuotes);
  }, [sortBy]);

  useEffect(() => {
    const filtered = quotes.filter(quote =>
      quote.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuotes(filtered);
  }, [searchTerm, quotes]);

  const handleGetQuote = async (quote: InsuranceQuote) => {
    let currentEmail = userEmail;
    let currentReferralCode = referralCode;
    let urlReferralCode = referralCodeFromUrl || localStorage.getItem('referralCode');

    if (!currentEmail) {
      const email = prompt('Please enter your email to get a quote:');
      if (!email) return;
      currentEmail = email;
      setUserEmail(email);
      
      // Create user and get referral code
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        const data = await response.json();
        currentReferralCode = data.referralCode;
        setReferralCode(data.referralCode);

        // If there's a referral code from URL, create referral record
        if (urlReferralCode && urlReferralCode !== data.referralCode) {
          await fetch('/api/referrals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              referrerEmail: '', // Will be looked up by referral code
              referredEmail: email,
              referralCode: urlReferralCode,
            }),
          });
        }
      }
    }
    
    // Use URL referral code if available, otherwise use user's own code
    const codeToUse = urlReferralCode && urlReferralCode !== currentReferralCode 
      ? urlReferralCode 
      : currentReferralCode;
    
    // In a real app, this would redirect to the insurance company's signup page
    // For now, we'll track the signup
    await fetch('/api/signups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail: currentEmail,
        companyName: quote.companyName,
        referralCode: codeToUse,
      }),
    });
    
    alert(`Redirecting to ${quote.companyName} signup page...`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">P3Insurance</h1>
              <p className="text-sm text-gray-600">Compare & Save on Car Insurance</p>
            </div>
            <div className="flex gap-4">
              {userEmail && (
                <button
                  onClick={() => setShowDashboard(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  Dashboard
                </button>
              )}
              <button
                onClick={() => setShowReferralModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Referral Program
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Referral Banner */}
      {referralCodeFromUrl && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-green-600" />
              <p className="text-green-800">
                <strong>You were referred!</strong> Sign up using this link to help your friend earn a bonus.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Find the Best Car Insurance Rates
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Compare quotes from top insurance companies and save up to $500/year
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search insurance companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'name')}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <TrendingDown className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">$500+</div>
              <div className="text-sm text-gray-600">Average Savings</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">6+</div>
              <div className="text-sm text-gray-600">Top Companies</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Gift className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">$25</div>
              <div className="text-sm text-gray-600">Referral Bonus</div>
            </div>
          </div>
        </div>

        {/* Insurance Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.map((quote) => (
            <InsuranceCard
              key={quote.id}
              quote={quote}
              onGetQuote={() => handleGetQuote(quote)}
            />
          ))}
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No insurance companies found matching your search.</p>
          </div>
        )}
      </section>

      {/* Referral Modal */}
      {showReferralModal && (
        <ReferralModal
          userEmail={userEmail}
          referralCode={referralCode}
          onClose={() => setShowReferralModal(false)}
          onEmailSubmit={async (email: string) => {
            setUserEmail(email);
            const response = await fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email }),
            });
            if (response.ok) {
              const data = await response.json();
              setReferralCode(data.referralCode);
            }
          }}
        />
      )}

      {/* Dashboard Modal */}
      {showDashboard && userEmail && (
        <Dashboard
          userEmail={userEmail}
          onClose={() => setShowDashboard(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">© 2024 P3Insurance. All rights reserved.</p>
            <p className="text-sm text-gray-500 mt-2">
              Compare rates and earn referral bonuses when your friends sign up!
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
