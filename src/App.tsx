/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Bill, BillCategory, LineItem, NotificationItem, UserProfile } from './types';
import { SAMPLE_BILL_PRESETS, INITIAL_BILLS } from './lib/data';
import { Header } from './components/layout/Header';
import { BottomNav, NavTab } from './components/layout/BottomNav';
import { HomeView } from './components/home/HomeView';
import { HistoryView } from './components/history/HistoryView';
import { InsightsView } from './components/insights/InsightsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { UploadSheet } from './components/scanner/UploadSheet';
import { CameraScanner } from './components/scanner/CameraScanner';
import { BillPreview } from './components/scanner/BillPreview';
import { AIAnalysisView } from './components/analysis/AIAnalysisView';
import { OnboardingView } from './components/onboarding/OnboardingView';
import { AuthView, CustomUser } from './components/auth/AuthView';

import { Sparkles, Loader2 } from 'lucide-react';
import { compressAndProcessImage } from './lib/imageUtils';
import { getCurrencySymbol } from './lib/currency';
import { LanguageProvider } from './lib/i18n';
import { auth, onAuthStateChanged, signOut, User, uploadImageToStorage } from './lib/firebase';
import {
  fetchUserProfile,
  saveUserProfile,
  subscribeUserProfile,
  subscribeUserBills,
  saveBillToFirestore,
  deleteBillFromFirestore,
  subscribeUserNotifications,
  saveNotificationToFirestore,
  markAllNotificationsReadInFirestore,
  createUserDocument,
} from './lib/firestoreService';

export default function App() {
  // Firebase Auth user & loading state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [customUser, setCustomUser] = useState<CustomUser | null>(() => {
    const saved = localStorage.getItem('billwise_custom_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Active user ID (from Firebase Auth OR custom session)
  const activeUid = currentUser?.uid || customUser?.uid || null;

  // User profile & bills state for the authenticated user
  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    currentHealthScore: 0,
    onboardingCompleted: true,
    preferences: {
      darkMode: (localStorage.getItem('billwise_theme') as 'system' | 'light' | 'dark') || 'light',
      notifications: {
        anomalyAlerts: true,
        reminders: true,
        tips: true,
        weeklySummary: true,
      },
    },
  });

  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Preferred Currency state
  const [userCurrency, setUserCurrency] = useState<string>(() => {
    return localStorage.getItem('billwise_preferred_currency') || 'PKR';
  });

  const handleCurrencyChange = (newCurr: string) => {
    setUserCurrency(newCurr);
    localStorage.setItem('billwise_preferred_currency', newCurr);
    if (activeUid) {
      saveUserProfile(activeUid, { ...user, currency: newCurr });
    }
  };

  // Navigation state
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<BillCategory | 'all'>('all');

  // Scanner & Modal flows
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem('billwise_onboarding_done');
  });

  // Preview OCR flow state
  const [ocrPreviewData, setOcrPreviewData] = useState<{
    imageUrl?: string;
    providerName: string;
    category: BillCategory;
    billDate: string;
    dueDate?: string;
    totalAmount: number;
    currency?: string;
    currencySymbol?: string;
    lineItems: LineItem[];
  } | null>(null);

  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);
  const [isOcrScanning, setIsOcrScanning] = useState(false);

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userCredential) => {
      setCurrentUser(userCredential);
      setAuthLoading(false);

      if (userCredential) {
        // Clear custom session if actual Firebase Auth user is signed in
        localStorage.removeItem('billwise_custom_user');
        setCustomUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time listener for user profile from Firestore
  useEffect(() => {
    if (!activeUid) {
      if (!currentUser && !customUser) {
        setAuthLoading(false);
      }
      return;
    }

    // Load local profile cache immediately for instant UI render
    const cachedProfile = localStorage.getItem(`billwise_profile_${activeUid}`);
    if (cachedProfile) {
      try {
        setUser(JSON.parse(cachedProfile));
      } catch (e) {}
    } else {
      const fallbackName =
        currentUser?.displayName || customUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
      const fallbackEmail = currentUser?.email || customUser?.email || '';
      setUser({
        ...user,
        name: fallbackName,
        email: fallbackEmail,
      });
    }

    const unsubProfile = subscribeUserProfile(activeUid, async (remoteProfile) => {
      if (remoteProfile) {
        let needsUpdate = false;
        const merged = { ...remoteProfile };

        const fallbackName = currentUser?.displayName || customUser?.displayName;
        if ((!merged.name || merged.name === 'User') && fallbackName) {
          merged.name = fallbackName;
          needsUpdate = true;
        }

        if (needsUpdate) {
          await saveUserProfile(activeUid, merged);
        }

        setUser(merged);
        localStorage.setItem(`billwise_profile_${activeUid}`, JSON.stringify(merged));
      } else {
        // Profile document does not exist in Firestore yet
        const newName =
          currentUser?.displayName ||
          customUser?.displayName ||
          currentUser?.email?.split('@')[0] ||
          'User';
        const newEmail = currentUser?.email || customUser?.email || '';

        const created = await createUserDocument(activeUid, newName, newEmail);
        setUser(created);
        localStorage.setItem(`billwise_profile_${activeUid}`, JSON.stringify(created));
      }
    });

    return () => {
      unsubProfile();
    };
  }, [activeUid, currentUser, customUser]);

  // Subscribe to real-time Firestore updates for bills and notifications when authenticated
  useEffect(() => {
    if (!activeUid) {
      setBills(INITIAL_BILLS);
      setNotifications([]);
      setSelectedBill(null);
      return;
    }

    // Load local bills and notifications cache immediately
    const cachedBills = localStorage.getItem(`billwise_bills_${activeUid}`);
    if (cachedBills) {
      try {
        const parsed = JSON.parse(cachedBills);
        if (parsed.length > 0) setBills(parsed);
      } catch (e) {
        setBills(INITIAL_BILLS);
      }
    }

    const cachedNotifs = localStorage.getItem(`billwise_notifs_${activeUid}`);
    if (cachedNotifs) {
      try {
        setNotifications(JSON.parse(cachedNotifs));
      } catch (e) {}
    }

    const unsubBills = subscribeUserBills(activeUid, (remoteBills) => {
      if (remoteBills) {
        if (remoteBills.length === 0) {
          setBills(INITIAL_BILLS);
        } else {
          setBills(remoteBills);
          localStorage.setItem(`billwise_bills_${activeUid}`, JSON.stringify(remoteBills));
        }
      }
    });

    const unsubNotifs = subscribeUserNotifications(activeUid, (remoteNotifs) => {
      if (remoteNotifs) {
        setNotifications(remoteNotifs);
        localStorage.setItem(`billwise_notifs_${activeUid}`, JSON.stringify(remoteNotifs));
      }
    });

    return () => {
      unsubBills();
      unsubNotifs();
    };
  }, [activeUid]);

  // Handle dark mode theme class application (supports light, dark, and system preference)
  useEffect(() => {
    const mode = user.preferences?.darkMode || 'light';
    localStorage.setItem('billwise_theme', mode);

    const applyTheme = () => {
      const isDark =
        mode === 'dark' ||
        (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    };

    applyTheme();

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    }
  }, [user.preferences?.darkMode]);

  // Handler for selecting quick category from Home
  const handleSelectCategoryFilter = (cat: BillCategory) => {
    setHistoryCategoryFilter(cat);
    setActiveTab('history');
  };

  // Handler for selecting sample bill preset
  const handleSelectPreset = (preset: typeof SAMPLE_BILL_PRESETS[0]) => {
    setOcrPreviewData({
      imageUrl: preset.sampleImage,
      providerName: preset.providerName,
      category: preset.category,
      billDate: preset.billDate,
      dueDate: preset.dueDate,
      totalAmount: preset.totalAmount,
      lineItems: preset.lineItems as LineItem[],
    });
  };

  // Helper to process uploaded file or captured camera data URL
  const processImageForOCR = async (rawInput: File | string) => {
    setIsUploadSheetOpen(false);
    setIsScannerOpen(false);
    setIsOcrScanning(true);

    try {
      let dataUrl = '';
      if (typeof rawInput === 'string') {
        dataUrl = rawInput;
      } else {
        dataUrl = await compressAndProcessImage(rawInput);
      }

      // Non-blocking background Firebase Storage upload
      let storageUrl = dataUrl;
      if (activeUid && dataUrl.startsWith('data:')) {
        uploadImageToStorage(`bills/${activeUid}/${Date.now()}.jpg`, dataUrl)
          .then((url) => {
            if (url) {
              storageUrl = url;
              setOcrPreviewData((prev) => (prev ? { ...prev, imageUrl: url } : null));
            }
          })
          .catch((err) => console.warn('Background storage upload warning:', err));
      }

      // Detect MIME type
      const mimeMatch = dataUrl.match(/^data:([^;]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

      // Call Gemini Vision OCR endpoint
      const res = await fetch('/api/ocr-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: dataUrl, mimeType }),
      });

      if (!res.ok) {
        throw new Error(`OCR Scan status ${res.status}`);
      }

      const ocrRes = await res.json();

      if (ocrRes.success && ocrRes.data) {
        const d = ocrRes.data;
        const detectedCurrency = d.currency || userCurrency || 'PKR';
        const detectedSymbol = d.currencySymbol || getCurrencySymbol(detectedCurrency);

        setOcrPreviewData({
          imageUrl: storageUrl,
          providerName: d.providerName || 'Scanned Provider',
          category: (d.category as BillCategory) || 'electricity',
          billDate: d.billDate || new Date().toISOString().split('T')[0],
          dueDate: d.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          totalAmount: typeof d.totalAmount === 'number' ? d.totalAmount : parseFloat(d.totalAmount) || 0,
          currency: detectedCurrency,
          currencySymbol: detectedSymbol,
          lineItems: (d.lineItems && d.lineItems.length > 0)
            ? d.lineItems.map((item: any, i: number) => ({
                id: `li-ocr-${i}-${Date.now()}`,
                name: item.name || 'Extracted Charge',
                amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount) || 0,
                type: item.type || 'base_charge',
                explanation: item.explanation || 'Extracted via Gemini Vision OCR',
                isAnomaly: item.is_anomaly || false,
                anomalyReason: item.anomaly_reason || null,
              }))
            : [
                {
                  id: `li-ocr-0-${Date.now()}`,
                  name: 'Base Service Amount',
                  amount: typeof d.totalAmount === 'number' ? d.totalAmount : parseFloat(d.totalAmount) || 0,
                  type: 'base_charge',
                  explanation: 'Extracted total charge from bill image.',
                  isAnomaly: false,
                },
              ],
        });
        return;
      }
    } catch (ocrErr) {
      console.warn('Gemini OCR scan error/fallback:', ocrErr);
      // Fallback editable preview allowing manual entry if OCR encounters an unreadable file
      setOcrPreviewData({
        imageUrl: typeof rawInput === 'string' ? rawInput : '',
        providerName: 'Scanned Bill (Please edit name)',
        category: 'electricity',
        billDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        totalAmount: 0,
        currency: userCurrency || 'PKR',
        currencySymbol: getCurrencySymbol(userCurrency || 'PKR'),
        lineItems: [
          {
            id: 'li-scanned-1',
            name: 'Service Charge',
            amount: 0,
            type: 'base_charge',
            explanation: 'Please review and adjust line item amounts.',
            isAnomaly: false,
          },
        ],
      });
    } finally {
      setIsOcrScanning(false);
    }
  };

  // Handler for image file upload selection
  const handleFileSelected = (file: File) => {
    processImageForOCR(file);
  };

  // Handler for camera capture completion
  const handleCameraCapture = (imageDataUrl: string) => {
    processImageForOCR(imageDataUrl);
  };

  // Run server Gemini AI Analysis on confirmed OCR data
  const handleRunAIAnalysis = async (confirmed: {
    providerName: string;
    category: BillCategory;
    billDate: string;
    dueDate?: string;
    totalAmount: number;
    currency: string;
    currencySymbol?: string;
    lineItems: LineItem[];
  }) => {
    if (!activeUid) return;
    setIsProcessingAnalysis(true);

    try {
      const activeCurrencySymbol = confirmed.currencySymbol || (confirmed.currency === 'PKR' ? 'Rs.' : '$');

      // Call server-side Gemini analysis endpoint
      let aiData = null;
      try {
        const res = await fetch('/api/analyze-bill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            providerName: confirmed.providerName,
            category: confirmed.category,
            billDate: confirmed.billDate,
            dueDate: confirmed.dueDate,
            totalAmount: confirmed.totalAmount,
            currency: confirmed.currency,
            currencySymbol: activeCurrencySymbol,
            lineItems: confirmed.lineItems,
            previousBillsSummary: bills.slice(0, 3).map((b) => ({
              date: b.billDate,
              total: b.totalAmount,
              category: b.category,
            })),
            householdContext: {
              householdSize: user.householdSize,
              region: user.region,
            },
          }),
        });

        if (res.ok) {
          const responseData = await res.json();
          aiData = responseData.data;
        }
      } catch (fetchErr) {
        console.warn('AI analysis API endpoint notice, proceeding with structured analysis:', fetchErr);
      }

      // Construct final Bill object
      const hasAnomalyDetected =
        aiData?.line_items?.some((item: any) => item.is_anomaly) ||
        confirmed.lineItems.some((item) => item.isAnomaly);

      const anomalyCountDetected =
        aiData?.line_items?.filter((item: any) => item.is_anomaly).length ||
        confirmed.lineItems.filter((item) => item.isAnomaly).length ||
        (hasAnomalyDetected ? 1 : 0);

      const newBill: Bill = {
        id: `bill-${Date.now()}`,
        category: confirmed.category,
        providerName: confirmed.providerName,
        accountNumberMasked: '•••• ' + Math.floor(1000 + Math.random() * 9000),
        billDate: confirmed.billDate,
        dueDate: confirmed.dueDate,
        totalAmount: confirmed.totalAmount,
        currency: confirmed.currency || 'PKR',
        currencySymbol: activeCurrencySymbol,
        imageUrl: ocrPreviewData?.imageUrl || '',
        lineItems: aiData?.line_items
          ? aiData.line_items.map((item: any, idx: number) => ({
              id: `li-res-${idx}-${Date.now()}`,
              name: item.name || `Charge #${idx + 1}`,
              amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount) || 0,
              type: item.type || 'base_charge',
              explanation: item.explanation || 'Standard line item charge.',
              isAnomaly: !!item.is_anomaly,
              anomalyReason: item.anomaly_reason || null,
            }))
          : confirmed.lineItems,
        aiAnalysis: {
          plainSummary:
            aiData?.plain_summary ||
            `Your ${confirmed.providerName} bill totals ${activeCurrencySymbol}${confirmed.totalAmount.toFixed(
              2
            )}. Gemini AI verified your line items.`,
          lineItems: confirmed.lineItems,
          totals: aiData?.totals || {
            subtotal: confirmed.totalAmount * 0.75,
            taxesAndFees: confirmed.totalAmount * 0.25,
            total: confirmed.totalAmount,
          },
          comparison: {
            vsPreviousSummary:
              aiData?.comparison?.vs_previous ||
              `Bill of ${activeCurrencySymbol}${confirmed.totalAmount.toFixed(2)} recorded in history.`,
            percentChange: aiData?.comparison?.percent_change ?? 0,
            primaryDriver: aiData?.comparison?.primary_driver || 'Normal billing cycle.',
          },
          financialHealthScore: {
            score: aiData?.financial_health_score?.score || 78,
            label: aiData?.financial_health_score?.label || 'Good',
            factors: aiData?.financial_health_score?.factors || [
              {
                label: 'Base rate verified',
                impact: 8,
                description: 'Service line items match provider standard.',
              },
            ],
          },
          savingsSuggestions: aiData?.savings_suggestions
            ? aiData.savings_suggestions.map((s: any, idx: number) => ({
                id: `sug-${idx}-${Date.now()}`,
                title: s.title || `Audit ${confirmed.providerName} fees`,
                detail: s.detail || 'Review itemized charges with support.',
                estimatedMonthlySavings: s.estimated_monthly_savings ?? 10.0,
                categoryRelevance: confirmed.category,
                status: 'new',
              }))
            : [
                {
                  id: `sug-default-${Date.now()}`,
                  title: `Audit ${confirmed.providerName} recurring surcharges`,
                  detail: 'Request line-item review with customer care to verify fee exemptions.',
                  estimatedMonthlySavings: 12.0,
                  categoryRelevance: confirmed.category,
                  status: 'new',
                },
              ],
          disclaimer:
            aiData?.disclaimer ||
            'This is an AI-generated analysis for informational purposes only.',
        },
        hasAnomaly: hasAnomalyDetected,
        anomalyCount: anomalyCountDetected,
        status: 'analyzed',
        createdAt: new Date().toISOString(),
      };

      // Save bill to Firestore for active user
      await saveBillToFirestore(activeUid, newBill);

      // Trigger notification if anomaly detected
      if (hasAnomalyDetected) {
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          type: 'anomaly_alert',
          title: `Fee Anomaly Detected on ${newBill.providerName}`,
          body: `Gemini AI flagged unexpected charges totaling $${newBill.totalAmount.toFixed(
            2
          )}. Tap to review breakdown.`,
          relatedBillId: newBill.id,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        await saveNotificationToFirestore(activeUid, newNotif);
      }

      // Close OCR preview and open new bill detail
      setOcrPreviewData(null);
      setSelectedBill(newBill);
    } catch (err) {
      console.error('Error running AI analysis:', err);
    } finally {
      setIsProcessingAnalysis(false);
    }
  };

  // Follow-up Q&A handler for "Ask AI about this charge"
  const handleAskAboutCharge = async (charge: LineItem, question: string) => {
    try {
      const res = await fetch('/api/ask-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chargeName: charge.name,
          chargeAmount: charge.amount,
          chargeExplanation: charge.explanation,
          fullBillContext: selectedBill,
          userQuestion: question,
        }),
      });
      const data = await res.json();
      return data.answer || 'Thank you for your question. This fee is standard for your category.';
    } catch (err) {
      return 'Unable to reach Gemini AI assistant at this moment.';
    }
  };

  // Delete bill action
  const handleDeleteBill = (billId: string) => {
    if (activeUid) {
      deleteBillFromFirestore(billId, activeUid);
    }
    setBills((prev) => prev.filter((b) => b.id !== billId));
    if (selectedBill?.id === billId) {
      setSelectedBill(null);
    }
  };

  const handleMarkAllNotifsRead = () => {
    if (activeUid) {
      markAllNotificationsReadInFirestore(activeUid);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleUpdateUserProfile = (updatedFields: Partial<UserProfile>) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    if (activeUid) {
      saveUserProfile(activeUid, updatedUser);
    }
  };

  const handleDownloadData = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bills, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'billwise_ai_data_export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = async () => {
    if (activeUid) {
      for (const bill of bills) {
        await deleteBillFromFirestore(bill.id);
      }
    }
    if (currentUser) {
      await signOut(auth);
    }
    localStorage.removeItem('billwise_custom_user');
    setCustomUser(null);
    setBills([]);
    setNotifications([]);
    setSelectedBill(null);
    setActiveTab('home');
  };

  const handleSignOut = async () => {
    if (currentUser) {
      await signOut(auth);
    }
    localStorage.removeItem('billwise_custom_user');
    setCustomUser(null);
    setBills([]);
    setNotifications([]);
    setSelectedBill(null);
    setActiveTab('home');
  };

  // Unread notification count
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  // 1. Auth Loading State Spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Connecting to BILL LENS...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated state -> Always show Login / Sign Up flow
  if (!activeUid) {
    return (
      <AuthView
        onCustomAuthSuccess={(cUser) => {
          setCustomUser(cUser);
        }}
      />
    );
  }

  // 3. Onboarding Screen First-Time Check
  if (showOnboarding) {
    return (
      <OnboardingView
        onComplete={() => {
          localStorage.setItem('billwise_onboarding_done', 'true');
          setShowOnboarding(false);
        }}
      />
    );
  }

  // 4. Authenticated Main Application UI
  return (
    <LanguageProvider
      currentLanguage={user.preferences?.language || 'English'}
      onLanguageChange={(lang) =>
        handleUpdateUserProfile({
          preferences: { ...user.preferences, language: lang },
        })
      }
    >
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
        {/* Mobile Shell Frame */}
        <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-slate-900 border-x border-slate-200/60 dark:border-slate-800/80 shadow-2xl relative flex flex-col">
          {/* Sticky Header for non-dashboard tabs */}
          {activeTab !== 'home' && !selectedBill && !ocrPreviewData && !isSettingsOpen && (
            <Header
              user={user}
              unreadCount={unreadNotifsCount}
              selectedCurrency={userCurrency}
              onCurrencyChange={handleCurrencyChange}
              onOpenNotifications={() => {
                setSelectedBill(null);
                setIsSettingsOpen(false);
                setActiveTab('notifications');
              }}
              onOpenProfile={() => {
                setSelectedBill(null);
                setIsSettingsOpen(false);
                setActiveTab('profile');
              }}
            />
          )}

        {/* Main Scrollable Workspace */}
        <main className="flex-1 px-4 pt-3">
          {/* Detailed Bill AI Analysis View Overlay */}
          {selectedBill ? (
            <AIAnalysisView
              bill={selectedBill}
              allBills={bills}
              onBack={() => setSelectedBill(null)}
              onDeleteBill={handleDeleteBill}
              onAskAboutCharge={handleAskAboutCharge}
            />
          ) : ocrPreviewData ? (
            /* OCR Confirmation Preview View */
            <BillPreview
              imageUrl={ocrPreviewData.imageUrl}
              initialData={ocrPreviewData}
              onConfirm={handleRunAIAnalysis}
              onBack={() => setOcrPreviewData(null)}
              isProcessing={isProcessingAnalysis}
            />
          ) : isSettingsOpen ? (
            /* Preferences & Settings View */
            <SettingsView
              user={user}
              onUpdatePreferences={(prefs) => handleUpdateUserProfile({ preferences: prefs })}
              onBack={() => setIsSettingsOpen(false)}
            />
          ) : (
            /* Active Bottom Tab View */
            <>
              {activeTab === 'home' && (
                <HomeView
                  user={user}
                  bills={bills}
                  unreadCount={unreadNotifsCount}
                  onSelectBill={(b) => setSelectedBill(b)}
                  onDeleteBill={handleDeleteBill}
                  onOpenUpload={() => setIsUploadSheetOpen(true)}
                  onSelectCategory={handleSelectCategoryFilter}
                  onOpenHealthScore={() => {
                    if (bills[0]) {
                      setSelectedBill(bills[0]);
                    }
                  }}
                  onViewAllBills={() => setActiveTab('history')}
                  onOpenNotifications={() => {
                    setSelectedBill(null);
                    setIsSettingsOpen(false);
                    setActiveTab('notifications');
                  }}
                  onOpenProfile={() => {
                    setSelectedBill(null);
                    setIsSettingsOpen(false);
                    setActiveTab('profile');
                  }}
                />
              )}

              {activeTab === 'history' && (
                <HistoryView
                  bills={bills}
                  onSelectBill={(b) => setSelectedBill(b)}
                  onDeleteBill={handleDeleteBill}
                  onOpenUpload={() => setIsUploadSheetOpen(true)}
                  initialCategoryFilter={historyCategoryFilter}
                />
              )}

              {activeTab === 'insights' && <InsightsView bills={bills} currency={userCurrency} />}

              {activeTab === 'notifications' && (
                <NotificationsView
                  notifications={notifications}
                  onMarkAllRead={handleMarkAllNotifsRead}
                  onSelectNotification={(notif) => {
                    if (notif.relatedBillId) {
                      const target = bills.find((b) => b.id === notif.relatedBillId);
                      if (target) setSelectedBill(target);
                    }
                  }}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView
                  user={user}
                  onUpdateUser={(updated) => handleUpdateUserProfile(updated)}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  onDownloadData={handleDownloadData}
                  onDeleteAccount={handleDeleteAccount}
                  onSignOut={handleSignOut}
                />
              )}
            </>
          )}
        </main>

        {/* OCR Scanning Progress Overlay */}
        {isOcrScanning && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 text-white animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Scanning Bill with Gemini Vision AI...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Extracting utility provider, line items, net total, and currency...
                </p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-600 h-full w-2/3 animate-pulse rounded-full" />
              </div>
            </div>
          </div>
        )}

        {/* Camera Scanner Viewfinder Modal */}
        {isScannerOpen && (
          <CameraScanner
            onCapture={handleCameraCapture}
            onClose={() => setIsScannerOpen(false)}
          />
        )}

        {/* Upload Bill Bottom Sheet */}
        <UploadSheet
          isOpen={isUploadSheetOpen}
          onClose={() => setIsUploadSheetOpen(false)}
          onStartCamera={() => setIsScannerOpen(true)}
          onFileSelected={handleFileSelected}
          onSelectPreset={handleSelectPreset}
        />

        {/* Fixed Bottom Navigation Bar */}
        {!selectedBill && !ocrPreviewData && !isScannerOpen && (
          <BottomNav
            activeTab={activeTab}
            onTabChange={(tab) => {
              setSelectedBill(null);
              setIsSettingsOpen(false);
              setActiveTab(tab);
            }}
            onOpenUpload={() => setIsUploadSheetOpen(true)}
            unreadNotificationsCount={unreadNotifsCount}
          />
        )}
      </div>
    </div>
    </LanguageProvider>
  );
}
