import React, { useState } from 'react';
import {
  Sparkles,
  PiggyBank,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Zap,
  Droplet,
  Flame,
  Wifi,
  HeartPulse,
  ShoppingBag,
  Shield,
  FileText,
  Share2,
} from 'lucide-react';
import { BillCategory, SavingsSuggestion } from '../../types';
import { formatCurrency } from '../../lib/currency';

interface SavingsTipsViewProps {
  suggestions: SavingsSuggestion[];
  currency?: string;
  onFeedback?: (id: string, isHelpful: boolean) => void;
}

export const SavingsTipsView: React.FC<SavingsTipsViewProps> = ({
  suggestions,
  currency = 'PKR',
  onFeedback,
}) => {
  const [feedbackState, setFeedbackState] = useState<Record<string, 'helpful' | 'dismissed'>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'electricity', label: 'Electricity' },
    { id: 'internet', label: 'Internet' },
    { id: 'hospital', label: 'Hospital' },
    { id: 'water', label: 'Water' },
  ];

  const handleFeedbackClick = (id: string, type: 'helpful' | 'dismissed') => {
    setFeedbackState((prev) => ({ ...prev, [id]: type }));
    if (onFeedback) {
      onFeedback(id, type === 'helpful');
    }
  };

  const filteredSuggestions = suggestions.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.categoryRelevance === selectedCategory;
  });

  const totalPotentialSavings = suggestions.reduce(
    (sum, s) => sum + (s.estimatedMonthlySavings || 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Total Savings Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Identified Potential Savings
          </span>
          <h3 className="text-xl font-black">
            {formatCurrency(totalPotentialSavings, currency)}{' '}
            <span className="text-xs font-normal text-emerald-100">/ month</span>
          </h3>
          <p className="text-[11px] text-emerald-100 mt-0.5">
            Based on your line-item tariff analysis & usage patterns.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
          <PiggyBank className="w-7 h-7" />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {filteredSuggestions.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              No active tips for this category
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Your billing structure looks optimized! Check back after your next scan.
            </p>
          </div>
        ) : (
          filteredSuggestions.map((tip) => {
            const status = feedbackState[tip.id];

            return (
              <div
                key={tip.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-2.5 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {tip.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {tip.detail}
                      </p>
                    </div>
                  </div>

                  {tip.estimatedMonthlySavings && (
                    <div className="shrink-0 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 px-2.5 py-1 rounded-xl text-center">
                      <span className="block text-[9px] font-bold uppercase tracking-wider">
                        Est. Save
                      </span>
                      <span className="text-xs font-black">
                        Save {formatCurrency(tip.estimatedMonthlySavings, currency)}/mo
                      </span>
                    </div>
                  )}
                </div>

                {/* Feedback & Actions Bar */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Was this tip useful?
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleFeedbackClick(tip.id, 'helpful')}
                      className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                        status === 'helpful'
                          ? 'bg-emerald-500 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{status === 'helpful' ? 'Saved' : 'Helpful'}</span>
                    </button>

                    <button
                      onClick={() => handleFeedbackClick(tip.id, 'dismissed')}
                      className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                        status === 'dismissed'
                          ? 'bg-slate-500 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Not Relevant</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
