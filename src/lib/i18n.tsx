import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'English' | 'Urdu';

export const translations = {
  English: {
    // Nav & Header
    appName: 'BILL LENS AI',
    appSubtitle: 'Pakistani Utility Smart Expense Engine',
    home: 'Home',
    history: 'History',
    analytics: 'Analytics',
    healthScoreNav: 'Score',
    profile: 'Profile',
    scanBill: 'Scan Bill',
    notifications: 'Notifications',
    clearAll: 'Clear All',
    noNotifications: 'No notifications yet',

    // Greetings & Top Banner
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    savedMonthly: 'You saved',
    withAiInsights: 'with AI insights this month',
    searchPlaceholder: 'Search bills or account number...',

    // Financial Health Score
    healthScoreTitle: 'Financial Health Score',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    needsAttention: 'Needs Attention',
    notSet: 'Not Set',
    viewScoreDetails: 'Tap for breakdown',

    // Recommendations & Banners
    smartAiRecommendation: 'Smart AI Recommendation',
    saveMonthlyTip: 'Save ~₨ 4,200/mo',
    recommendationText: 'Shift your inverter AC usage during Peak Hours (5 PM – 11 PM) to stay below the 500 unit non-protected tariff slab.',
    anomalyDetected: 'Surcharge Anomaly Detected',
    anomalyDetail: 'Bill contains ₨ 4,120 Fuel Adjustment surcharge (+32%).',
    reviewBtn: 'Review',

    // Quick Actions
    quickActions: 'Quick Actions',
    uploadBillAction: 'Upload Bill',
    viewHistoryAction: 'View History',
    compareAction: 'Compare',
    exportPdfAction: 'Export PDF',

    // Categories
    utilityCategories: 'Utility Categories',
    tapToFilter: 'Tap to filter',
    allBills: 'All Bills',
    electricity: 'Electricity',
    gas: 'Gas',
    internet: 'Internet',
    water: 'Water',
    retail: 'Mobile',
    hospital: 'Medical & Clinic',
    insurance: 'Insurance',
    other: 'Other',

    // Scan Banner
    scanBannerTitle: 'Scan Any Utility Bill',
    scanBannerSubtitle: 'Instantly extract charges, detect taxes & uncover hidden savings.',
    scanNow: 'Scan Now',

    // Recent Bills
    recentBills: 'Recent Bills',
    viewAll: 'View All',
    noBillsFound: 'No bills found matching search',
    noBillsSubtitle: 'Try searching for utility bills or add a new bill.',
    addBillNow: 'Add Bill Now',

    // Breakdown Donut
    categoryBreakdown: 'Monthly Category Breakdown',
    totalTracked: 'total tracked',

    // History View
    historyTitle: 'Bill History Timeline',
    historySubtitle: 'Pakistani utility bills scanned & stored',
    filterCategory: 'Filter Category',
    sortBy: 'Sort',
    newestDate: 'Newest Date',
    highestAmount: 'Highest Amount',

    // Analytics View
    analyticsTitle: 'Analytics & AI Insights',
    analyticsSubtitle: 'Pakistani household bill trends & cost optimizations',
    totalTrackedSpend: 'Total Tracked Spend',
    largestExpense: 'Largest Expense',
    spendingTrend: 'Spending Trend (6 Months)',
    providerComparison: 'Utility Provider Comparison',
    scoreHistoryTitle: 'Financial Score History',
    aiRecommendedTips: 'AI Recommended Savings Tips',

    // Profile View
    userInfo: 'User Information',
    editInfo: 'Edit Information',
    fullName: 'Full Name',
    householdMembers: 'Household Members',
    propertyType: 'Property Type',
    cityRegion: 'City / Region',
    saveProfileDetails: 'Save Profile Details',
    homeCategory: 'Home Category',
    persons: 'Persons',
    appPreferences: 'App Preferences',
    currencyLabel: 'Currency',
    currencyValue: 'Pakistani Rupee (PKR - ₨)',
    preferredLanguage: 'Preferred Language',
    darkMode: 'Dark Mode',
    aiSettingsAlerts: 'AI Settings & Anomaly Alerts',
    dataAndAccount: 'Data & Account',
    exportAllData: 'Export All Bill Data (JSON)',
    signOut: 'Sign Out',
    deleteAccount: 'Delete Account & Purge Bills',
    confirmDeleteAccount: 'Confirm Account Deletion',
    deleteWarning: 'This action is permanent and will completely remove all your stored LESCO, SNGPL, PTCL bills and AI insights from BILL LENS.',
    cancel: 'Cancel',
    permanentlyDelete: 'Permanently Delete',

    // Upload Modal
    uploadBillTitle: 'Scan or Upload Utility Bill',
    uploadBillSub: 'Upload a clear photo or PDF of your LESCO, SNGPL, PTCL or WASA bill',
    dragDropText: 'Drag & drop your utility bill image here, or',
    browseFiles: 'Browse files',
    supportedFormats: 'Supports JPG, PNG, WEBP, PDF up to 15MB',
    orPreset: 'OR SELECT SAMPLE PAKISTANI BILL PRESETS',
    analyzingBill: 'Analyzing Utility Bill with Gemini AI...',
    ocrExtracting: 'Extracting meter readings, fuel adjustments, GST, FPA and slab tariffs',

    // Scanner & Preview Flow Keys
    addBillTitle: 'Add a Bill for AI Analysis',
    addBillSub: 'Scan or select a photo of your bill',
    scanWithCamera: 'Scan with Camera',
    cameraGuidelines: 'Capture live photo with auto document guidelines',
    choosePhotoOrPdf: 'Choose Photo or PDF',
    dropBillHere: 'Drop Bill File Here',
    uploadDocDesc: 'Upload JPG, PNG, or PDF bill document from device',
    trySamplePreset: 'Or Try a Sample Bill (Instant Demo)',
    tryPresetBtn: 'Try',
    billScannerTitle: 'Bill Scanner',
    alignFrame: 'Align bill within frame',
    retake: 'Retake',
    usePhoto: 'Use Photo',
    backToScanner: 'Back to Scanner',
    step2ConfirmOcr: 'Step 2: Confirm OCR',
    ocrExtracted: 'OCR Extracted',
    keyBillMetadata: 'Key Bill Metadata',
    providerCompanyName: 'Provider / Company Name',
    billCategory: 'Bill Category',
    totalAmountDue: 'Total Amount Due',
    currency: 'Currency',
    itemizedLineItems: 'Itemized Line Items',
    addItem: 'Add Item',
    chargeNamePlaceholder: 'Charge name',
    baseCharge: 'Base Charge',
    feeSurcharge: 'Fee / Surcharge',
    tax: 'Tax',
    discount: 'Discount',
    runningGeminiAnalysis: 'Running Gemini AI Analysis...',
    analyzeBillWithAiBtn: 'Analyze Bill with Gemini AI',
    identifiedSavings: 'Identified Potential Savings',
    perMonth: '/ month',
    savingsBasedOn: 'Based on your line-item tariff analysis & usage patterns.',
    estSave: 'Est. Save',
    save: 'Save',
    wasTipUseful: 'Was this tip useful?',
    helpful: 'Helpful',
    savedTip: 'Saved',
    notRelevant: 'Not Relevant',
    noTipsCategory: 'No active tips for this category',
    optimizedStructure: 'Your billing structure looks optimized! Check back after your next scan.',
    financialHealthScoreTitle: 'Your Financial Health Score',
    scoreMethodology: 'Calculated automatically from charge stability, anomaly frequency, & unbundled fee ratio.',
    scoreHistory: 'Score History (6 Months)',
    overallImprovement: '+6 pts overall',
    contributingFactors: 'Contributing Score Factors',
    scoreMethodologyModalTitle: 'Score Methodology',
    gotIt: 'Got it',

    // Dynamic & Additional Labels
    welcomeBackSub: "Welcome back! Let's manage your utility bills smarter.",
    savedWithAi: 'Saved with AI',
    searchResults: 'Search Results',
    clearSearch: 'Clear Search',
    noBillsMatching: 'No bills found matching',
    searchTip: 'Try searching for provider (e.g. LESCO, PTCL), category, account #, or amount.',
    due: 'Due',
    paidStatus: 'PAID',
    unpaidStatus: 'UNPAID',
    overdueStatus: 'OVERDUE',
    billDetails: 'Bill Details',
    billingMonth: 'Billing Month',
    issueDate: 'Issue Date',
    dueDateLabel: 'Due Date',
    accountNumberLabel: 'Account / Consumer #',
    totalAmountLabel: 'Total Amount Payable',
    lateAmountLabel: 'Amount After Due Date',
    unitsConsumedLabel: 'Units / Consumption',
    tariffSlabLabel: 'Tariff Slab',
    aiAnalysisTitle: 'Gemini AI Bill Breakdown',
    taxAndSurcharges: 'Taxes & Fuel Surcharges',
    lineItemsTitle: 'Detailed Line Items',
    downloadPdf: 'Download PDF / Receipt',
    markAsPaid: 'Mark as Paid',
    markAsUnpaid: 'Mark as Unpaid',
    deleteBill: 'Delete Bill',
    backToDashboard: 'Back to Dashboard',
    compareBills: 'Compare Bills',
    financialScoreBreakdown: 'Financial Health Breakdown',
    monthlyBudgetLimit: 'Monthly Utility Budget',
    notificationsAlerts: 'Notifications & Alerts',
    allClear: 'All clear! No pending alerts.',
  },
  Urdu: {
    // Nav & Header
    appName: 'بل لینس AI',
    appSubtitle: 'پاکستانی یوٹیلٹی بل کا ذہین حساب کتاب',
    home: 'ہوم',
    history: 'ہسٹری',
    analytics: 'تجزیہ',
    healthScoreNav: 'اسکور',
    profile: 'پروفائل',
    scanBill: 'بل اسکین کریں',
    notifications: 'اطلاعات',
    clearAll: 'تمام صاف کریں',
    noNotifications: 'کوئی نوٹیفکیشن موجود نہیں ہے',

    // Greetings & Top Banner
    goodMorning: 'صبح بخیر',
    goodAfternoon: 'دوپہر بخیر',
    goodEvening: 'شام بخیر',
    savedMonthly: 'آپ نے بچائے',
    withAiInsights: 'اس ماہ AI کی مدد سے',
    searchPlaceholder: 'لیسکو، ایس این جی پی ایل، پی ٹی سی ایل یا اکاؤنٹ نمبر تلاش کریں...',

    // Financial Health Score
    healthScoreTitle: 'مالیاتی صحت اسکور',
    excellent: 'عمدہ',
    good: 'اچھا',
    fair: 'مناسب',
    needsAttention: 'توجہ کی ضرورت',
    notSet: 'سیٹ نہیں ہے',
    viewScoreDetails: 'تفصیلات کے لیے ٹیپ کریں',

    // Recommendations & Banners
    smartAiRecommendation: 'ذہین AI تجاویز',
    saveMonthlyTip: 'ماہانہ تقریباً 4,200 روپے بچائیں',
    recommendationText: 'لیسکو کے پیک آورز (شام 5 سے رات 11 بجے) کے دوران انورٹر اے سی کا استعمال کم کریں تاکہ 500 یونٹ سے کم رہیں اور زیادہ ٹیرف سے بچیں۔',
    anomalyDetected: 'اضافی سرچارج کی نشاندہی',
    anomalyDetail: 'لیسکو کے بل میں 4,120 روپے فیول ایڈجسٹمنٹ شامل ہے۔',
    reviewBtn: 'جائزہ لیں',

    // Quick Actions
    quickActions: 'فوری اقدامات',
    uploadBillAction: 'بل اپلوڈ کریں',
    viewHistoryAction: 'ہسٹری دیکھیں',
    compareAction: 'موازنہ کریں',
    exportPdfAction: 'پی ڈی ایف ایکسپورٹ',

    // Categories
    utilityCategories: 'یوٹیلٹی کیٹیگریز',
    tapToFilter: 'فلٹر کے لیے ٹیپ کریں',
    allBills: 'تمام بلز',
    electricity: 'بجلی',
    gas: 'گیس',
    internet: 'انٹرنیٹ',
    water: 'پانی',
    retail: 'موبائل',
    hospital: 'میڈیکل اور کلینک',
    insurance: 'انشورنس',
    other: 'دیگر بلز',

    // Scan Banner
    scanBannerTitle: 'کسی بھی یوٹیلٹی بل کو اسکین کریں',
    scanBannerSubtitle: 'چارجز نکالیں، ٹیکسز اور چھپے اخراجات فوری معلوم کریں۔',
    scanNow: 'ابھی اسکین کریں',

    // Recent Bills
    recentBills: 'حالیہ بلز',
    viewAll: 'تمام دیکھیں',
    noBillsFound: 'کوئی بل نہیں ملا',
    noBillsSubtitle: 'بل یا اکاؤنٹ نمبر تلاش کریں یا نیا بل شامل کریں۔',
    addBillNow: 'نیا بل شامل کریں',

    // Breakdown Donut
    categoryBreakdown: 'ماہانہ کیٹیگری کی تفصیل',
    totalTracked: 'کل ٹریک شدہ',

    // History View
    historyTitle: 'بلوں کی ہسٹری',
    historySubtitle: 'اسکین اور محفوظ شدہ پاکستانی بلز',
    filterCategory: 'کیٹیگری منتخب کریں',
    sortBy: 'ترتیب',
    newestDate: 'نئی تاریخ',
    highestAmount: 'زیادہ رقم',

    // Analytics View
    analyticsTitle: 'تجزیہ اور AI بصیرت',
    analyticsSubtitle: 'پاکستانی گھریلو بلوں کے رجحانات اور بچت',
    totalTrackedSpend: 'کل ٹریک شدہ اخراجات',
    largestExpense: 'سب سے بڑا خرچہ',
    spendingTrend: 'اخراجات کا رجحان (6 ماہ)',
    providerComparison: 'یوٹیلٹی فراہم کنندگان کا موازنہ',
    scoreHistoryTitle: 'مالیاتی اسکور کی ہسٹری',
    aiRecommendedTips: 'AI کی تجویز کردہ بچت کی تجاویز',

    // Profile View
    userInfo: 'صارف کی معلومات',
    editInfo: 'معلومات میں ترمیم کریں',
    fullName: 'پورا نام',
    householdMembers: 'گھر کے افراد',
    propertyType: 'جائیداد کی قسم',
    cityRegion: 'شہر / علاقہ',
    saveProfileDetails: 'تفصیلات محفوظ کریں',
    homeCategory: 'گھر کی قسم',
    persons: 'افراد',
    appPreferences: 'ایپ کی ترجیحات',
    currencyLabel: 'کرنسی',
    currencyValue: 'پاکستانی روپیہ (PKR - ₨)',
    preferredLanguage: 'پسندیدہ زبان',
    darkMode: 'ڈارک موڈ',
    aiSettingsAlerts: 'AI سیٹنگز اور الرٹس',
    dataAndAccount: 'ڈیٹا اور اکاؤنٹ',
    exportAllData: 'تمام بل ڈیٹا ایکسپورٹ کریں (JSON)',
    signOut: 'سائن آؤٹ',
    deleteAccount: 'اکاؤنٹ اور تمام بل ختم کریں',
    confirmDeleteAccount: 'اکاؤنٹ ختم کرنے کی تصدیق',
    deleteWarning: 'یہ عمل مستقل ہے۔ آپ کے تمام محفوظ شدہ بلز اور AI ڈیٹا ختم ہو جائے گا۔',
    cancel: 'منسوخ کریں',
    permanentlyDelete: 'مستقل ختم کریں',

    // Upload Modal
    uploadBillTitle: 'بل کی تصویر یا پی ڈی ایف اپلوڈ کریں',
    uploadBillSub: 'لیسکو، ایس این جی پی ایل یا پی ٹی سی ایل کے بل کی واضع تصویر اپلوڈ کریں',
    dragDropText: 'بل کی تصویر یہاں ڈریگ اور ڈراپ کریں، یا',
    browseFiles: 'فائلز منتخب کریں',
    supportedFormats: 'JPG, PNG, WEBP, PDF سپورٹڈ ہے',
    orPreset: 'یا نمونہ بل منتخب کریں',
    analyzingBill: 'Gemini AI کے ذریعے بل کا تجزیہ ہو رہا ہے...',
    ocrExtracting: 'میٹر ریڈنگ، فیول ایڈجسٹمنٹ اور ٹیکسز نکالے جا رہے ہیں...',

    // Scanner & Preview Flow Keys
    addBillTitle: 'AI تجزیہ کے لیے بل شامل کریں',
    addBillSub: 'اپنے بل کی تصویر اسکین یا منتخب کریں',
    scanWithCamera: 'کیمرے سے اسکین کریں',
    cameraGuidelines: 'دستاویز کی رہنمائی کے ساتھ لائیو تصویر لیں',
    choosePhotoOrPdf: 'تصویر یا پی ڈی ایف منتخب کریں',
    dropBillHere: 'بل فائل یہاں ڈراپ کریں',
    uploadDocDesc: 'ڈیوائس سے JPG، PNG یا PDF بل فائل اپ لوڈ کریں',
    trySamplePreset: 'یا نمونہ بل آزمائیں (فوری ڈیمو)',
    tryPresetBtn: 'آزمائیں',
    billScannerTitle: 'بل اسکینر',
    alignFrame: 'بل کو فریم کے اندر رکھیں',
    retake: 'دوبارہ تصویر لیں',
    usePhoto: 'تصویر استعمال کریں',
    backToScanner: 'اسکینر پر واپس جائیں',
    step2ConfirmOcr: 'مرحلہ 2: OCR کی تصدیق کریں',
    ocrExtracted: 'OCR سے حاصل شدہ',
    keyBillMetadata: 'بل کی بنیادی معلومات',
    providerCompanyName: 'فراہم کنندہ / کمپنی کا نام',
    billCategory: 'بل کی کیٹیگری',
    totalAmountDue: 'کل واجب الادا رقم',
    currency: 'کرنسی',
    itemizedLineItems: 'تفصیلی چارجز کی فہرست',
    addItem: 'آئٹم شامل کریں',
    chargeNamePlaceholder: 'چارج کا نام',
    baseCharge: 'بنیادی چارج',
    feeSurcharge: 'فیس / سرچارج',
    tax: 'ٹیکس',
    discount: 'رعایت',
    runningGeminiAnalysis: 'Gemini AI سے تجزیہ ہو رہا ہے...',
    analyzeBillWithAiBtn: 'Gemini AI کے ساتھ بل کا تجزیہ کریں',
    identifiedSavings: 'شناخت شدہ ممکنہ بچت',
    perMonth: '/ ماہ',
    savingsBasedOn: 'آپ کے ٹیرف اور استعمال کی بنیاد پر۔',
    estSave: 'تخمینہ بچت',
    save: 'بچت',
    wasTipUseful: 'کیا یہ تجویز مفید تھی؟',
    helpful: 'مفید',
    savedTip: 'محفوظ شدہ',
    notRelevant: 'غیر متعلقہ',
    noTipsCategory: 'اس کیٹیگری کے لیے کوئی نیا مشورہ نہیں ہے',
    optimizedStructure: 'آپ کا بلنگ کا ڈھانچہ بہترین لگتا ہے! آئندہ اسکین پر دوبارہ دیکھیں',
    financialHealthScoreTitle: 'آپ کا مالیاتی صحت اسکور',
    scoreMethodology: 'چارجز کے استحکام اور فیس کا خودکار تجزیہ۔',
    scoreHistory: 'اسکور کی تاریخ (6 ماہ)',
    overallImprovement: 'کل +6 پوائنٹس کا اضافہ',
    contributingFactors: 'اسکور کے معاون عوامل',
    scoreMethodologyModalTitle: 'اسکور کا طریقہ کار',
    gotIt: 'ٹھیک ہے',

    // Dynamic & Additional Labels
    welcomeBackSub: 'خوش آمدید! اپنے یوٹیلٹی بلز کا زیادہ عقلمندی سے انتظام کریں۔',
    savedWithAi: 'AI سے بچت',
    searchResults: 'تلاش کے نتائج',
    clearSearch: 'تلاش صاف کریں',
    noBillsMatching: 'کوئی بل نہیں ملا',
    searchTip: 'فراہم کنندہ (جیسے LESCO, PTCL)، کیٹیگری، اکاؤنٹ نمبر یا رقم کے ذریعے تلاش کریں۔',
    due: 'آخری تاریخ',
    paidStatus: 'ادا شدہ',
    unpaidStatus: 'غیر ادا شدہ',
    overdueStatus: 'میعاد ختم',
    billDetails: 'بل کی تفصیلات',
    billingMonth: 'بلنگ کا مہینہ',
    issueDate: 'تاریخِ اجراء',
    dueDateLabel: 'آخری تاریخ',
    accountNumberLabel: 'اکاؤنٹ / کنزیومر نمبر',
    totalAmountLabel: 'کل واجب الادا رقم',
    lateAmountLabel: 'تاریخ کے بعد کی رقم',
    unitsConsumedLabel: 'استعمال شدہ یونٹس',
    tariffSlabLabel: 'ٹیرف سلیب',
    aiAnalysisTitle: 'Gemini AI بل کا تجزیہ',
    taxAndSurcharges: 'ٹیکسز اور سرچارجز',
    lineItemsTitle: 'تفصیلی فہرست',
    downloadPdf: 'پی ڈی ایف / رسیپٹ ڈاؤن لوڈ کریں',
    markAsPaid: 'ادا شدہ نشان زد کریں',
    markAsUnpaid: 'غیر ادا شدہ نشان زد کریں',
    deleteBill: 'بل ڈیلیٹ کریں',
    backToDashboard: 'ڈیش بورڈ پر واپس جائیں',
    compareBills: 'بلوں کا موازنہ کریں',
    financialScoreBreakdown: 'مالیاتی صحت کی تفصیل',
    monthlyBudgetLimit: 'ماہانہ یوٹیلٹی بجٹ',
    notificationsAlerts: 'اطلاعات اور الرٹس',
    allClear: 'تمام ٹھیک ہے! کوئی نیا الرٹ موجود نہیں ہے۔',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['English']) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'English',
  setLanguage: () => {},
  t: (key) => translations.English[key] || key,
});

export const LanguageProvider: React.FC<{
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
  children: React.ReactNode;
}> = ({ currentLanguage = 'English', onLanguageChange, children }) => {
  const [language, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('billwise_lang');
    if (saved === 'Urdu' || saved === 'English') return saved as Language;
    return currentLanguage || 'English';
  });

  useEffect(() => {
    if (currentLanguage && currentLanguage !== language) {
      setLangState(currentLanguage);
    }
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem('billwise_lang', language);
    if (language === 'Urdu') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ur');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLangState(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const t = (key: keyof typeof translations['English']): string => {
    const dict = translations[language] || translations.English;
    return dict[key] || translations.English[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
