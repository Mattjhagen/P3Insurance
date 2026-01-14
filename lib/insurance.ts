// Mock insurance data - In production, this would connect to real insurance APIs
export interface InsuranceQuote {
  id: string;
  companyName: string;
  companyLogo: string;
  monthlyPremium: number;
  annualPremium: number;
  coverage: {
    liability: string;
    collision: string;
    comprehensive: string;
    deductible: string;
  };
  features: string[];
  rating: number;
  reviews: number;
}

// Mock insurance companies data
const insuranceCompanies: InsuranceQuote[] = [
  {
    id: 'geico',
    companyName: 'GEICO',
    companyLogo: '🦎',
    monthlyPremium: 89.50,
    annualPremium: 1074.00,
    coverage: {
      liability: '$100k/$300k',
      collision: 'Full Coverage',
      comprehensive: 'Full Coverage',
      deductible: '$500',
    },
    features: ['24/7 Support', 'Mobile App', 'Multi-Car Discount', 'Safe Driver Discount'],
    rating: 4.5,
    reviews: 12500,
  },
  {
    id: 'progressive',
    companyName: 'Progressive',
    companyLogo: '🚗',
    monthlyPremium: 92.30,
    annualPremium: 1107.60,
    coverage: {
      liability: '$100k/$300k',
      collision: 'Full Coverage',
      comprehensive: 'Full Coverage',
      deductible: '$500',
    },
    features: ['Name Your Price', 'Snapshot Discount', 'Bundle Discount', 'Online Claims'],
    rating: 4.4,
    reviews: 9800,
  },
  {
    id: 'statefarm',
    companyName: 'State Farm',
    companyLogo: '🏢',
    monthlyPremium: 95.75,
    annualPremium: 1149.00,
    coverage: {
      liability: '$100k/$300k',
      collision: 'Full Coverage',
      comprehensive: 'Full Coverage',
      deductible: '$500',
    },
    features: ['Local Agent', 'Steer Clear Program', 'Drive Safe & Save', 'Good Neighbor'],
    rating: 4.6,
    reviews: 15200,
  },
  {
    id: 'allstate',
    companyName: 'Allstate',
    companyLogo: '🛡️',
    monthlyPremium: 98.20,
    annualPremium: 1178.40,
    coverage: {
      liability: '$100k/$300k',
      collision: 'Full Coverage',
      comprehensive: 'Full Coverage',
      deductible: '$500',
    },
    features: ['Accident Forgiveness', 'Safe Driving Bonus', 'Deductible Rewards', '24/7 Claims'],
    rating: 4.3,
    reviews: 8700,
  },
  {
    id: 'usaa',
    companyName: 'USAA',
    companyLogo: '⭐',
    monthlyPremium: 76.50,
    annualPremium: 918.00,
    coverage: {
      liability: '$100k/$300k',
      collision: 'Full Coverage',
      comprehensive: 'Full Coverage',
      deductible: '$500',
    },
    features: ['Military Discount', 'Member Benefits', 'Low Rates', 'Excellent Service'],
    rating: 4.8,
    reviews: 21000,
  },
  {
    id: 'farmers',
    companyName: 'Farmers',
    companyLogo: '🌾',
    monthlyPremium: 101.40,
    annualPremium: 1216.80,
    coverage: {
      liability: '$100k/$300k',
      collision: 'Full Coverage',
      comprehensive: 'Full Coverage',
      deductible: '$500',
    },
    features: ['Signal App', 'Multi-Policy Discount', 'Good Student Discount', 'Pay Plan Options'],
    rating: 4.2,
    reviews: 6400,
  },
];

export function getInsuranceQuotes(filters?: {
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'rating' | 'name';
}): InsuranceQuote[] {
  let quotes = [...insuranceCompanies];

  // Apply filters
  if (filters?.minPrice) {
    quotes = quotes.filter(q => q.monthlyPremium >= filters.minPrice!);
  }
  if (filters?.maxPrice) {
    quotes = quotes.filter(q => q.monthlyPremium <= filters.maxPrice!);
  }

  // Apply sorting
  if (filters?.sortBy === 'price') {
    quotes.sort((a, b) => a.monthlyPremium - b.monthlyPremium);
  } else if (filters?.sortBy === 'rating') {
    quotes.sort((a, b) => b.rating - a.rating);
  } else if (filters?.sortBy === 'name') {
    quotes.sort((a, b) => a.companyName.localeCompare(b.companyName));
  }

  return quotes;
}

export function getQuoteById(id: string): InsuranceQuote | undefined {
  return insuranceCompanies.find(q => q.id === id);
}
