'use client';

import { Star, Check, ArrowRight } from 'lucide-react';
import { InsuranceQuote } from '@/lib/insurance';

interface InsuranceCardProps {
  quote: InsuranceQuote;
  onGetQuote: () => void;
}

export default function InsuranceCard({ quote, onGetQuote }: InsuranceCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{quote.companyLogo}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{quote.companyName}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-700">{quote.rating}</span>
                <span className="text-sm text-gray-500">({quote.reviews.toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="text-3xl font-bold text-indigo-600 mb-1">
            ${quote.monthlyPremium.toFixed(2)}
            <span className="text-lg font-normal text-gray-600">/month</span>
          </div>
          <div className="text-sm text-gray-600">
            ${quote.annualPremium.toFixed(2)}/year
          </div>
        </div>

        {/* Coverage Details */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Liability:</span>
            <span className="font-semibold text-gray-900">{quote.coverage.liability}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Collision:</span>
            <span className="font-semibold text-gray-900">{quote.coverage.collision}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Comprehensive:</span>
            <span className="font-semibold text-gray-900">{quote.coverage.comprehensive}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Deductible:</span>
            <span className="font-semibold text-gray-900">{quote.coverage.deductible}</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
          <ul className="space-y-1">
            {quote.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={onGetQuote}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Get Quote
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
