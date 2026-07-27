import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  PieChart as PieChartIcon,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  ShieldCheck,
  Zap,
  Flame,
  Wifi,
  Droplet,
  CheckCircle2
} from 'lucide-react';
import { Bill } from '../../types';
import { CATEGORY_CONFIG } from '../../lib/data';
import { formatCurrency } from '../../lib/currency';
import { useLanguage } from '../../lib/i18n';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface InsightsViewProps {
  bills: Bill[];
  currency?: string;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ bills, currency = 'PKR' }) => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | '1Y'>('6M');

  const totalSpend = useMemo(() => bills.reduce((sum, b) => sum + b.totalAmount, 0), [bills]);

  // Category totals for donut
  const categoryKeys = Object.keys(CATEGORY_CONFIG) as (keyof typeof CATEGORY_CONFIG)[];
  const categoryTotals = useMemo(() => {
    return categoryKeys
      .map((cat) => {
        const catBills = bills.filter((b) => b.category === cat);
        const total = catBills.reduce((acc, b) => acc + b.totalAmount, 0);
        return {
          name: CATEGORY_CONFIG[cat]?.label || cat,
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

  const topCategory =
    categoryTotals.length > 0
      ? categoryTotals.sort((a, b) => b.value - a.value)[0]?.name || 'None'
      : 'None';

  // Compute real monthly timeline chart data from user's bills
  const timelineData = useMemo(() => {
    if (bills.length === 0) return [];

    const monthMap: Record<string, { month: string; Total: number; [key: string]: any }> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    bills.forEach((b) => {
      const dateObj = new Date(b.billDate || b.createdAt);
      const mName = monthNames[dateObj.getMonth()] || 'Month';
      if (!monthMap[mName]) {
        monthMap[mName] = { month: mName, Total: 0 };
      }
      monthMap[mName].Total += b.totalAmount;
      const provKey = b.providerName?.split(' ')[0] || b.category;
      monthMap[mName][provKey] = (monthMap[mName][provKey] || 0) + b.totalAmount;
    });

    return Object.values(monthMap);
  }, [bills]);

  // Compute real financial score history from user's bills
  const scoreHistory = useMemo(() => {
    if (bills.length === 0) return [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const map: Record<string, { scores: number[]; count: number }> = {};

    bills.forEach((b) => {
      if (b.aiAnalysis?.financialHealthScore?.score !== undefined) {
        const dateObj = new Date(b.billDate || b.createdAt);
        const mName = monthNames[dateObj.getMonth()] || 'Month';
        if (!map[mName]) map[mName] = { scores: [], count: 0 };
        map[mName].scores.push(b.aiAnalysis.financialHealthScore.score);
      }
    });

    return Object.entries(map).map(([month, data]) => ({
      month,
      score: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
    }));
  }, [bills]);

  // Extract real AI savings suggestions from user's bills
  const aiSavingsSuggestions = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      category: string;
      impact: string;
      detail: string;
      icon: any;
      color: string;
    }> = [];

    bills.forEach((b) => {
      if (b.aiAnalysis?.savingsSuggestions) {
        b.aiAnalysis.savingsSuggestions.forEach((s, idx) => {
          list.push({
            id: `sav-${b.id}-${idx}`,
            title: s.title,
            category: b.providerName || b.category,
            impact: s.estimatedMonthlySavings
              ? `Save ~${formatCurrency(s.estimatedMonthlySavings, currency)}/mo`
              : 'High Impact',
            detail: s.detail,
            icon: b.category === 'electricity' ? Zap : b.category === 'gas' ? Flame : Wifi,
            color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
          });
        });
      }
    });

    return list;
  }, [bills, currency]);

  return (
    <div className="space-y-6 pb-24 pt-2 animate-fade-in">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {t('analyticsTitle')}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {t('analyticsSubtitle')}
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          {(['3M', '6M', '1Y'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-[10px] font-black rounded-xl transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-gradient-to-r from-teal-500 to-sky-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {bills.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <PieChartIcon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            No Analytics Available Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            Scan or upload your first utility bill to unlock real-time spending trends, provider cost breakdowns, and personalized AI recommendations.
          </p>
        </div>
      ) : (
        <>
          {/* Top Stat Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Total Tracked Spend
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white block">
                {formatCurrency(totalSpend, currency)}
              </span>
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> {bills.length} Bill{bills.length > 1 ? 's' : ''} Scanned
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Largest Expense Category
              </span>
              <span className="text-base font-black text-slate-900 dark:text-white block truncate">
                {topCategory}
              </span>
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
                {categoryTotals.length > 0
                  ? `${Math.round(
                      ((categoryTotals.sort((a, b) => b.value - a.value)[0]?.value || 0) /
                        (totalSpend || 1)) *
                        100
                    )}% of total household bills`
                  : 'N/A'}
              </span>
            </div>
          </div>

          {/* Spending Trends Area Chart */}
          {timelineData.length > 0 && (
            <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-500" /> Spending Trend
                </h3>
                <span className="text-[11px] font-bold text-slate-400">Amounts in {currency}</span>
              </div>

              <div className="h-48 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} hide />
                    <Tooltip
                      formatter={(val: any) => [formatCurrency(val, currency), 'Total Spend']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="Total"
                      stroke="#0284c7"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#spendGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Financial Score History */}
          {scoreHistory.length > 0 && (
            <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Financial Score History
                </h3>
              </div>

              <div className="flex items-center justify-between pt-2">
                {scoreHistory.map((item) => (
                  <div key={item.month} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 font-black text-xs shadow-xs">
                      {item.score}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Savings Suggestions */}
          {aiSavingsSuggestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-500" /> AI Recommended Savings Tips
              </h3>

              {aiSavingsSuggestions.map((tip) => {
                const Icon = tip.icon;
                return (
                  <div
                    key={tip.id}
                    className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-2xl border ${tip.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">
                            {tip.title}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400">
                            {tip.category}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-[10px] font-black shrink-0">
                        {tip.impact}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium pl-1">
                      {tip.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
