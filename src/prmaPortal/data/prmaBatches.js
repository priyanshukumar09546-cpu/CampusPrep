// Batches and Duration options configured from reference screenshots

export const PRMA_BATCHES = [
  // Current / Upcoming Month: November 2026
  { id: 'nov-01', label: '1 Nov', date: '1 November 2026', month: 'Nov', isAvailable: true },
  { id: 'nov-07', label: '7 Nov', date: '7 November 2026', month: 'Nov', isAvailable: true },
  { id: 'nov-14', label: '14 Nov', date: '14 November 2026', month: 'Nov', isAvailable: true, isPopular: true },
  { id: 'nov-20', label: '20 Nov', date: '20 November 2026', month: 'Nov', isAvailable: true },
  { id: 'nov-24', label: '24 Nov', date: '24 November 2026', month: 'Nov', isAvailable: true },

  // December 2026
  { id: 'dec-01', label: '1 Dec', date: '1 December 2026', month: 'Dec', isAvailable: true },
  { id: 'dec-07', label: '7 Dec', date: '7 December 2026', month: 'Dec', isAvailable: true },
  { id: 'dec-14', label: '14 Dec', date: '14 December 2026', month: 'Dec', isAvailable: true },
  { id: 'dec-20', label: '20 Dec', date: '20 December 2026', month: 'Dec', isAvailable: true },
  { id: 'dec-24', label: '24 Dec', date: '24 December 2026', month: 'Dec', isAvailable: true },

  // January 2027
  { id: 'jan-01', label: '1 Jan', date: '1 January 2027', month: 'Jan', isAvailable: true },
  { id: 'jan-07', label: '7 Jan', date: '7 January 2027', month: 'Jan', isAvailable: true },
  { id: 'jan-14', label: '14 Jan', date: '14 January 2027', month: 'Jan', isAvailable: true },
  { id: 'jan-20', label: '20 Jan', date: '20 January 2027', month: 'Jan', isAvailable: true },
  { id: 'jan-24', label: '24 Jan', date: '24 January 2027', month: 'Jan', isAvailable: true }
];

export const PRMA_DURATIONS = [
  // Tier 1: Foundation & Project Programs
  {
    id: '2-weeks',
    weeks: 2,
    name: '2 Weeks',
    subText: '(15 Days)',
    price: 149,
    originalPrice: 249,
    badge: 'STARTER',
    badgeColor: '#0866F5',
    features: ['1 Foundation Project', 'Verified Certificate', 'Doubt Clearing Sessions']
  },
  {
    id: '4-weeks',
    weeks: 4,
    name: '4 Weeks',
    subText: '(1 Month)',
    price: 249,
    originalPrice: 415,
    badge: 'POPULAR',
    badgeColor: '#079B45',
    features: ['2 Guided Projects', 'Verified Certificate', 'Weekly Code Reviews', 'Stipend Eligible']
  },
  {
    id: '6-weeks',
    weeks: 6,
    name: '6 Weeks',
    subText: '(1.5 Months)',
    price: 299,
    originalPrice: 498,
    badge: 'TRENDING',
    badgeColor: '#7025E8',
    isTrending: true,
    features: ['3 Practical Projects', '1-on-1 Mentorship', 'Verified Certificate', 'Letter of Recommendation']
  },
  {
    id: '8-weeks',
    weeks: 8,
    name: '8 Weeks',
    subText: '(2 Months)',
    price: 349,
    originalPrice: 582,
    badge: 'RECOMMENDED',
    badgeColor: '#EA3323',
    features: ['Production Capstone', 'Full Career Support', 'Verified Certificate & LOR', 'Top 20% Performance Stipend']
  },

  // Tier 2: Deep Specialization & Career Track Programs
  {
    id: '12-weeks',
    weeks: 12,
    name: '12 Weeks',
    subText: '(3 Months)',
    price: 399,
    originalPrice: 665,
    badge: 'MOST POPULAR',
    badgeColor: '#FFBD12',
    isMostPopular: true,
    features: ['Multi-Sprint Projects', 'Mock Technical Interviews', 'Verified Certificate & LOR', 'Portfolio Review']
  },
  {
    id: '16-weeks',
    weeks: 16,
    name: '16 Weeks',
    subText: '(4 Months)',
    price: 499,
    originalPrice: 832,
    badge: 'RECOMMENDED',
    badgeColor: '#0866F5',
    features: ['Live Client Simulation', 'Comprehensive System Architecture', 'Guaranteed LOR', 'Priority Referrals']
  },
  {
    id: '24-weeks',
    weeks: 24,
    name: '24 Weeks',
    subText: '(6 Months)',
    price: 999,
    originalPrice: 1665,
    badge: 'PREMIUM',
    badgeColor: '#7025E8',
    features: ['Full Semester Internship Support', 'NOC / College Evaluation Format', 'Industry Mentor Assigned', 'Stipend Guarantee for Top Tier']
  },
  {
    id: '36-weeks',
    weeks: 36,
    name: '36 Weeks',
    subText: '(9 Months)',
    price: 1799,
    originalPrice: 2998,
    badge: 'ELITE',
    badgeColor: '#EA3323',
    features: ['Enterprise Fellowship Program', 'Multiple Production Systems Shipped', 'Direct Placement Assistance', 'Physical Welcome Kit Included Free']
  }
];
