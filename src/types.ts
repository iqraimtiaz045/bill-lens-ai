export type BillCategory =
  | 'electricity'
  | 'gas'
  | 'water'
  | 'internet'
  | 'hospital'
  | 'retail'
  | 'insurance'
  | 'other';

export type ChargeType = 'base_charge' | 'tax' | 'fee' | 'adjustment' | 'discount';

export interface LineItem {
  id: string;
  name: string;
  amount: number;
  type: ChargeType;
  explanation: string;
  isAnomaly: boolean;
  anomalyReason?: string | null;
}

export interface HealthFactor {
  label: string;
  impact: number; // positive or negative
  description?: string;
}

export interface HealthScoreSnapshot {
  score: number; // 0 - 100
  label: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  factors: HealthFactor[];
}

export interface SavingsSuggestion {
  id: string;
  title: string;
  detail: string;
  estimatedMonthlySavings: number | null;
  categoryRelevance: BillCategory | 'general';
  status?: 'new' | 'helpful' | 'dismissed';
}

export interface BillComparisonData {
  vsPreviousSummary?: string | null;
  percentChange?: number | null;
  primaryDriver?: string | null;
  previousBillTotal?: number | null;
  previousBillDate?: string | null;
}

export interface BillAnalysisResult {
  plainSummary: string;
  lineItems: LineItem[];
  totals: {
    subtotal: number;
    taxesAndFees: number;
    total: number;
  };
  comparison: BillComparisonData;
  financialHealthScore: HealthScoreSnapshot;
  savingsSuggestions: SavingsSuggestion[];
  disclaimer: string;
}

export interface Bill {
  id: string;
  category: BillCategory;
  providerName: string;
  accountNumberMasked?: string;
  billDate: string; // ISO date string YYYY-MM-DD
  dueDate?: string | null;
  billingPeriodStart?: string | null;
  billingPeriodEnd?: string | null;
  totalAmount: number;
  currency: string;
  currencySymbol?: string;
  imageUrl?: string;
  ocrRawText?: string;
  lineItems: LineItem[];
  aiAnalysis?: BillAnalysisResult;
  hasAnomaly: boolean;
  anomalyCount: number;
  status: 'pending' | 'analyzed' | 'error';
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  householdSize?: number;
  region?: string;
  homeType?: string;
  currency?: string;
  currentHealthScore?: number;
  onboardingCompleted?: boolean;
  preferences?: {
    darkMode: 'system' | 'light' | 'dark';
    language?: 'English' | 'Urdu';
    notifications: {
      anomalyAlerts: boolean;
      reminders: boolean;
      tips: boolean;
      weeklySummary: boolean;
    };
  };
}

export interface NotificationItem {
  id: string;
  type: 'analysis_complete' | 'anomaly_alert' | 'reminder' | 'tip';
  title: string;
  body: string;
  relatedBillId?: string | null;
  isRead: boolean;
  createdAt: string;
}
