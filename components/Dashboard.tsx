'use client';

import { X, DollarSign, Users, TrendingUp, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DashboardProps {
  userEmail: string;
  onClose: () => void;
}

interface ReferralData {
  id: number;
  referred_email: string;
  referral_code: string;
  status: string;
  bonus_amount: number;
  created_at: string;
  completed_at: string | null;
}

export default function Dashboard({ userEmail, onClose }: DashboardProps) {
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [totalBonus, setTotalBonus] = useState(0);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [userEmail]);

  const loadDashboardData = async () => {
    try {
      const response = await fetch(`/api/dashboard?email=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        setReferrals(data.referrals || []);
        setTotalBonus(data.totalBonus || 0);
        setReferralCode(data.referralCode || '');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
  const completedReferrals = referrals.filter(r => r.status === 'completed').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Referral Dashboard</h2>
              <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                      <p className="text-3xl font-bold text-gray-900">${totalBonus.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Completed Referrals</p>
                      <p className="text-3xl font-bold text-gray-900">{completedReferrals}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pending Referrals</p>
                      <p className="text-3xl font-bold text-gray-900">{pendingReferrals}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Referral Code */}
              {referralCode && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Your Referral Code:</p>
                  <p className="text-2xl font-mono font-bold text-indigo-600">{referralCode}</p>
                </div>
              )}

              {/* Referrals List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Referral History
                </h3>
                {referrals.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No referrals yet. Start sharing your code!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {referrals.map((referral) => (
                      <div
                        key={referral.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{referral.referred_email}</p>
                            <p className="text-sm text-gray-600">
                              Referred on {new Date(referral.created_at).toLocaleDateString()}
                            </p>
                            {referral.completed_at && (
                              <p className="text-sm text-green-600">
                                Completed on {new Date(referral.completed_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                referral.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {referral.status === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                            {referral.status === 'completed' && (
                              <p className="text-lg font-bold text-green-600 mt-2">
                                +${referral.bonus_amount.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
