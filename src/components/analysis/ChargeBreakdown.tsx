import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  Send,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';
import { LineItem } from '../../types';
import { formatCurrency } from '../../lib/currency';

interface ChargeBreakdownProps {
  lineItems: LineItem[];
  subtotal: number;
  taxesAndFees: number;
  total: number;
  billProvider: string;
  currency?: string;
  onAskAboutCharge: (
    charge: LineItem,
    question: string
  ) => Promise<string>;
}

export const ChargeBreakdown: React.FC<ChargeBreakdownProps> = ({
  lineItems,
  subtotal,
  taxesAndFees,
  total,
  billProvider,
  currency = 'PKR',
  onAskAboutCharge,
}) => {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(
    lineItems[0]?.id || null
  );
  const [askingItemId, setAskingItemId] = useState<string | null>(null);
  const [userQuestion, setUserQuestion] = useState('');
  const [chatAnswers, setChatAnswers] = useState<Record<string, string>>({});
  const [loadingAnswers, setLoadingAnswers] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  const handleAskSubmit = async (item: LineItem) => {
    if (!userQuestion.trim()) return;
    const q = userQuestion;
    setUserQuestion('');
    setLoadingAnswers((prev) => ({ ...prev, [item.id]: true }));

    try {
      const answer = await onAskAboutCharge(item, q);
      setChatAnswers((prev) => ({ ...prev, [item.id]: answer }));
    } catch (err) {
      setChatAnswers((prev) => ({
        ...prev,
        [item.id]:
          'Unable to reach AI assistant right now. Please try again shortly.',
      }));
    } finally {
      setLoadingAnswers((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const getTypeBadge = (type: LineItem['type']) => {
    switch (type) {
      case 'tax':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
            Tax
          </span>
        );
      case 'fee':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            Fee / Surcharge
          </span>
        );
      case 'discount':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            Discount
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
            Base Charge
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Itemized Charge Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Explained in plain language by Gemini AI
          </p>
        </div>
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          {lineItems.length} Line Items
        </span>
      </div>

      {/* Accordion Line Items List */}
      <div className="space-y-2.5">
        {lineItems.map((item) => {
          const isExpanded = expandedItemId === item.id;
          const isAsking = askingItemId === item.id;
          const answer = chatAnswers[item.id];
          const isLoadingAnswer = loadingAnswers[item.id];

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                item.isAnomaly
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/80 shadow-2xs'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              {/* Row Header */}
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-3.5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  {item.isAnomaly ? (
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {item.name}
                      </h4>
                      {getTypeBadge(item.type)}
                      {item.isAnomaly && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300 flex items-center gap-0.5">
                          ⚠ Anomaly
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                    {formatCurrency(item.amount, currency)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details Panel */}
              {isExpanded && (
                <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 text-xs space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5 uppercase text-[10px] tracking-wider">
                      Plain English Explanation
                    </span>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>

                  {item.isAnomaly && item.anomalyReason && (
                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200">
                      <span className="font-bold block mb-0.5 text-[10px] uppercase tracking-wider flex items-center gap-1 text-rose-600 dark:text-rose-400">
                        <AlertTriangle className="w-3 h-3" /> Why this is flagged
                      </span>
                      <p className="text-xs leading-relaxed">{item.anomalyReason}</p>
                    </div>
                  )}

                  {/* Ask AI Follow-up section */}
                  <div className="pt-1">
                    {answer && (
                      <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 mb-2 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Gemini AI Clarification
                        </span>
                        <p className="text-xs leading-relaxed">{answer}</p>
                      </div>
                    )}

                    {!isAsking ? (
                      <button
                        onClick={() => setAskingItemId(item.id)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Ask AI about this charge &rarr;
                      </button>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                            placeholder={`Ask something about ${item.name}...`}
                            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            disabled={isLoadingAnswer}
                            onClick={() => handleAskSubmit(item)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 flex items-center gap-1 disabled:opacity-50"
                          >
                            {isLoadingAnswer ? (
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky Totals Summary Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-lg space-y-2 mt-4">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Base Services Subtotal:</span>
          <span className="font-semibold text-slate-200">{formatCurrency(subtotal, currency)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>Taxes & Regulatory Fees:</span>
          <span className="font-semibold text-slate-200">{formatCurrency(taxesAndFees, currency)}</span>
        </div>
        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-black">
          <span>Total Bill Amount:</span>
          <span className="text-lg text-emerald-400">{formatCurrency(total, currency)}</span>
        </div>
      </div>
    </div>
  );
};
