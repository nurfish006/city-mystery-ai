// lib/monetization/pricing.ts
export const PRICING = {
  ethiopia: {
    monthly: '49 ETB',    // ~$0.85 USD
    yearly: '490 ETB',    // ~$8.50 USD (2 months free)
    lifetime: '1490 ETB'  // ~$26 USD
  },
  international: {
    monthly: '$2.99',
    yearly: '$29.99',     // ~$2.50/month
    lifetime: '$49.99'
  },
  studentDiscount: {
    ethiopia: '50%',
    international: '40%'
  }
} as const;