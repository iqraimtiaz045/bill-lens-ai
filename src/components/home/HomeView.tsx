import React, { useMemo, useState } from 'react';
import {
  Zap,
  Droplet,
  Flame,
  Wifi,
  HeartPulse,
  ShoppingBag,
  Shield,
  FileText,
  AlertTriangle,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Receipt,
  Sparkles,
  Trash2,
  Search,
  CheckCircle2,
  Lightbulb,
  Upload,
  BarChart3,
  FileSpreadsheet,
  Layers,
  Clock,
  TrendingDown,
  Bell,
  X
} from 'lucide-react';
import { Bill, BillCategory, UserProfile } from '../../types';
import { CATEGORY_CONFIG } from '../../lib/data';
import { ScoreRing } from '../score/ScoreRing';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../lib/currency';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { useLanguage } from '../../lib/i18n';
import { matchesBillQuery } from '../../lib/search';

interface HomeViewProps {
  user: UserProfile;
  bills: Bill[];
  unreadCount?: number;
  onSelectBill: (bill: Bill) => void;
  onDeleteBill?: (billId: string) => void;
  onOpenUpload: () => void;
  onSelectCategory: (category: BillCategory) => void;
  onOpenHealthScore: () => void;
  onViewAllBills: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  bills,
  unreadCount = 0,
  onSelectBill,
  onDeleteBill,
  onOpenUpload,
  onSelectCategory,
  onOpenHealthScore,
  onViewAllBills,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const { t } = useLanguage();
  const [billToDelete, setBillToDelete] = useState<Bill | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categoryKeys: BillCategory[] = [
    'electricity',
    'gas',
    'internet',
    'water',
    'retail',
    'hospital',
    'insurance',
    'other',
  ];

  const getCategoryIcon = (category: BillCategory) => {
    switch (category) {
      case 'electricity':
        return Zap;
      case 'water':
        return Droplet;
      case 'gas':
        return Flame;
      case 'internet':
        return Wifi;
      case 'hospital':
        return HeartPulse;
      case 'retail':
        return ShoppingBag;
      case 'insurance':
        return Shield;
      default:
        return FileText;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Filter bills by search query
  const filteredBills = useMemo(() => {
    if (!searchQuery.trim()) return bills;
    return bills.filter((b) => matchesBillQuery(b, searchQuery));
  }, [bills, searchQuery]);

  // Compute key totals
  const totalMonthlySpend = useMemo(
    () => bills.reduce((sum, b) => sum + b.totalAmount, 0),
    [bills]
  );

  const totalAISavings = useMemo(() => {
    let savings = 0;
    for (const b of bills) {
      if (b.aiAnalysis?.savingsSuggestions) {
        for (const s of b.aiAnalysis.savingsSuggestions) {
          if (s.estimatedMonthlySavings) savings += s.estimatedMonthlySavings;
        }
      }
    }
    return savings;
  }, [bills]);

  const dueThisWeekCount = useMemo(() => {
    return bills.filter((b) => b.dueDate && new Date(b.dueDate) >= new Date()).length;
  }, [bills]);

  const anomalyBillsCount = useMemo(
    () => bills.filter((b) => b.hasAnomaly).length,
    [bills]
  );

  // Health Score Calculation
  const displayScore = useMemo(() => {
    if (!bills || bills.length === 0) return user?.currentHealthScore || 0;
    let totalScore = 0;
    let scoreCount = 0;
    for (const b of bills) {
      if (b.aiAnalysis?.financialHealthScore?.score !== undefined) {
        totalScore += b.aiAnalysis.financialHealthScore.score;
        scoreCount++;
      }
    }
    if (scoreCount > 0) return Math.round(totalScore / scoreCount);
    return user?.currentHealthScore || 0;
  }, [bills, user?.currentHealthScore]);

  const displayLabel = useMemo(() => {
    if (displayScore === 0) return 'Not Set';
    if (displayScore >= 80) return 'Excellent';
    if (displayScore >= 65) return 'Good';
    return 'Needs Attention';
  }, [displayScore]);

  // Category totals for Donut Chart
  const categoryTotals = useMemo(() => {
    return categoryKeys
      .map((cat) => {
        const catBills = bills.filter((b) => b.category === cat);
        const total = catBills.reduce((acc, b) => acc + b.totalAmount, 0);
        return {
          name: CATEGORY_CONFIG[cat]?.label || cat,
          category: cat,
          value: total,
          color:
            cat === 'electricity'
              ? '#0284c7'
              : cat === 'gas'
              ? '#f97316'
              : cat === 'internet'
              ? '#0d9488'
              : cat === 'water'
              ? '#0284c7'
              : cat === 'retail'
              ? '#6366f1'
              : cat === 'hospital'
              ? '#e11d48'
              : '#64748b',
        };
      })
      .filter((c) => c.value > 0);
  }, [bills]);

  // Time based greeting
  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 18) return t('goodAfternoon');
    return t('goodEvening');
  }, [t]);

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Full-Width Fintech Hero Header */}
      <div className="-mx-4 -mt-3 mb-6 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-950 text-white pt-5 pb-6 px-5 rounded-b-[28px] shadow-xl shadow-emerald-950/20 border-b border-emerald-500/20">
        {/* Subtle Abstract Wave & Glow Patterns */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Ambient Lighting Blurs */}
          <div className="absolute -top-12 -left-12 w-52 h-52 bg-emerald-400/25 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-12 w-56 h-56 bg-teal-300/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 left-1/3 w-44 h-44 bg-emerald-900/40 rounded-full blur-2xl" />

          {/* Abstract Wave / Geometric SVG Overlay */}
          <svg
            className="absolute right-0 bottom-0 w-80 h-48 text-emerald-300/10"
            viewBox="0 0 320 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120 C80 160, 160 80, 240 140 C280 170, 320 110, 360 150 L360 200 L0 200 Z"
              fill="currentColor"
            />
            <path
              d="M0 70 C100 130, 180 30, 260 100 C300 135, 340 70, 380 110"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />
            <path
              d="M20 30 C120 90, 200 10, 280 70"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
          </svg>
        </div>

        {/* Top Action Bar: User Profile Avatar & Notification Bell */}
        <div className="relative z-10 flex items-center justify-between">
          {/* User Profile Picture with circular frame & green online status indicator */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenProfile}
              className="relative group focus:outline-none cursor-pointer"
              title="Open Profile Settings"
            >
              <div className="w-11 h-11 rounded-full border-2 border-white/95 shadow-md ring-2 ring-emerald-300/30 overflow-hidden bg-emerald-800 flex items-center justify-center text-white font-black text-sm shrink-0 transition-transform group-hover:scale-105 active:scale-95">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{getInitials(user?.name || '')}</span>
                )}
              </div>
              {/* Online Status Indicator */}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white dark:border-emerald-950 rounded-full shadow-xs" />
            </button>

            {/* Brand / App Tag */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-extrabold tracking-wider text-emerald-200 uppercase">
              <Sparkles className="w-3 h-3 text-emerald-300" /> BILL LENS AI
            </div>
          </div>

          {/* Clean Notification Bell with Unread Badge */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/15 transition-all focus:outline-none cursor-pointer active:scale-95 shadow-xs"
            title="Notifications & Alerts"
          >
            <Bell className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-emerald-900 animate-ping" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-emerald-900" />
              </>
            )}
          </button>
        </div>

        {/* Greeting Section */}
        <div className="relative z-10 mt-4 space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            {greetingText} {user?.name ? user.name.split(' ')[0] : ''} 👋
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
            {t('welcomeBackSub')}
          </p>
        </div>

        {/* Saved with AI Insights & Search Row */}
        <div className="relative z-10 mt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {totalAISavings > 0 && (
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-black/25 backdrop-blur-md border border-white/15 text-xs shrink-0">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-200 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> {t('savedWithAi')}
              </span>
              <span className="font-extrabold text-white text-xs">
                {formatCurrency(totalAISavings, 'PKR')}
              </span>
            </div>
          )}

          {/* Search Input Bar in Front */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-emerald-200/80 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-8 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-xs font-medium text-white placeholder-emerald-100/70 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:bg-white/25 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-emerald-200 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                title={t('clearSearch')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Prominent Search Results Banner when searching */}
      {searchQuery.trim() && (
        <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 shadow-md space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                {t('searchResults')} ({filteredBills.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> {t('clearSearch')}
            </button>
          </div>

          {filteredBills.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-dashed border-emerald-300/60 dark:border-emerald-800/60">
              {t('noBillsMatching')} <span className="font-extrabold text-emerald-800 dark:text-emerald-300">"{searchQuery}"</span>. {t('searchTip')}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredBills.map((bill) => {
                const catConfig = CATEGORY_CONFIG[bill.category] || CATEGORY_CONFIG.other;
                const Icon = getCategoryIcon(bill.category);
                return (
                  <div
                    key={bill.id}
                    onClick={() => onSelectBill(bill)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800/80 hover:border-emerald-500 shadow-xs cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${catConfig.bgLight} ${catConfig.color}`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {bill.providerName}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium truncate">
                          {bill.accountNumberMasked || bill.id} • {t('due')} {bill.dueDate || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-900 dark:text-white block">
                        {formatCurrency(bill.totalAmount, 'PKR')}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        bill.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {bill.status === 'paid' ? t('paidStatus') : t('unpaidStatus')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Financial Health Score Ring Card */}
      <ScoreRing
        score={displayScore}
        label={displayLabel}
        onClick={onOpenHealthScore}
      />

      {/* Anomaly Warning Banner if any */}
      {anomalyBillsCount > 0 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black block">
                {anomalyBillsCount} {t('anomalyDetected')}
              </span>
              <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                {t('anomalyDetail')}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onViewAllBills}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-xs hover:bg-amber-400 transition-all cursor-pointer shrink-0"
          >
            {t('reviewBtn')}
          </button>
        </div>
      )}

      {/* AI Insights Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-teal-500/10 via-sky-500/5 to-transparent border border-teal-500/20 dark:border-teal-500/30 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-teal-500 text-white shadow-xs">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {t('smartAiRecommendation')}
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-[10px] font-extrabold">
            {t('saveMonthlyTip')}
          </span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {t('recommendationText')}
        </p>
      </div>



      {/* Horizontal Bill Categories Carousel */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {t('utilityCategories')}
          </h3>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">{t('tapToFilter')}</span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {categoryKeys.map((catKey) => {
            const config = CATEGORY_CONFIG[catKey] || CATEGORY_CONFIG.other;
            const Icon = getCategoryIcon(catKey);
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => onSelectCategory(catKey)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-extrabold whitespace-nowrap transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 cursor-pointer ${config.bgLight} ${config.border} ${config.color}`}
              >
                <Icon className="w-4 h-4" />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Scan Banner CTA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-sky-600 to-blue-600 text-white p-5 shadow-xl shadow-sky-600/20">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> {t('scanBill')}
            </span>
            <h3 className="text-base font-extrabold">{t('scanBannerTitle')}</h3>
            <p className="text-xs text-sky-100">
              {t('scanBannerSubtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenUpload}
            className="shrink-0 ml-3 px-4 py-3 rounded-2xl bg-white text-teal-800 font-black text-xs shadow-md hover:bg-teal-50 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> {t('scanNow')}
          </button>
        </div>
      </div>

      {/* Recent Bills List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
            {t('recentBills')} ({filteredBills.length})
          </h2>
          <button
            type="button"
            onClick={onViewAllBills}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            {t('viewAll')} <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {filteredBills.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <Receipt className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {t('noBillsFound')}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-4">
              {t('noBillsSubtitle')}
            </p>
            <button
              type="button"
              onClick={onOpenUpload}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold text-xs shadow-md hover:from-teal-600 hover:to-sky-700 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> {t('addBillNow')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBills.slice(0, 5).map((bill) => {
              const catConfig = CATEGORY_CONFIG[bill.category] || CATEGORY_CONFIG.other;
              const Icon = getCategoryIcon(bill.category);

              return (
                <div
                  key={bill.id}
                  onClick={() => onSelectBill(bill)}
                  className="group flex items-center justify-between p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${catConfig.bgLight} ${catConfig.color}`}
                    >
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {bill.providerName}
                        </h4>
                        {bill.hasAnomaly && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 flex items-center gap-0.5 shrink-0">
                            <AlertTriangle className="w-2.5 h-2.5" /> Anomaly
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium mt-0.5">
                        {bill.billDate} • {catConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 dark:text-white block">
                        {formatCurrency(bill.totalAmount, 'PKR')}
                      </span>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold flex items-center justify-end gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Analyzed
                      </span>
                    </div>

                    {onDeleteBill && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBillToDelete(bill);
                        }}
                        className="p-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/70 border border-rose-200/60 dark:border-rose-800/60 rounded-xl transition-all cursor-pointer shadow-xs ml-1"
                        title="Delete Bill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly Category Breakdown Donut Chart */}
      {categoryTotals.length > 0 && (
        <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Monthly Category Breakdown
              </h3>
              <p className="text-base font-black text-slate-900 dark:text-white">
                {formatCurrency(totalMonthlySpend, 'PKR')} <span className="text-xs font-normal text-slate-400">total tracked</span>
              </p>
            </div>
          </div>

          <div className="h-44 w-full flex items-center justify-between">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={categoryTotals}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={58}
                  paddingAngle={4}
                >
                  {categoryTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val, 'PKR'), 'Spent']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="w-[50%] pl-2 space-y-2 max-h-36 overflow-y-auto">
              {categoryTotals.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-slate-600 dark:text-slate-300 font-medium truncate">
                      {cat.name}
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency(cat.value, 'PKR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!billToDelete}
        itemName={billToDelete?.providerName}
        onConfirm={() => {
          if (billToDelete && onDeleteBill) {
            onDeleteBill(billToDelete.id);
          }
        }}
        onClose={() => setBillToDelete(null)}
      />
    </div>
  );
};
