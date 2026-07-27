import React, { useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Info,
} from 'lucide-react';
import { Bill } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BillComparisonViewProps {
  currentBill: Bill;
  previousBills: Bill[];
}

export const BillComparisonView: React.FC<BillComparisonViewProps> = ({
  currentBill,
  previousBills,
}) => {
  const [comparisonPeriod, setComparisonPeriod] = useState<
    'previous' | '3m_avg'
  >('previous');

  const comparison = currentBill.aiAnalysis?.comparison;

  // Build bar chart comparison data
  const prevBill = previousBills[0];
  const prevAmount = prevBill ? prevBill.totalAmount : (currentBill.totalAmount * 0.88);
  const prevLabel = prevBill ? prevBill.billDate : 'Previous Cycle';

  const chartData = [
    { name: prevLabel, amount: prevAmount, isCurrent: false },
    { name: 'Current Cycle', amount: currentBill.totalAmount, isCurrent: true },
  ];

  const amountDiff = currentBill.totalAmount - prevAmount;
  const percentDiff = prevAmount > 0 ? ((amountDiff / prevAmount) * 100).toFixed(1) : '0';
  const isHigher = amountDiff > 0;

  return (
    <div className="space-y-4">
      {/* Comparison Toggle */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        <button
          onClick={() => setComparisonPeriod('previous')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            comparisonPeriod === 'previous'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
              : 'text-slate-500'
          }`}
        >
          vs Previous Bill
        </button>
        <button
          onClick={() => setComparisonPeriod('3m_avg')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            comparisonPeriod === '3m_avg'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
              : 'text-slate-500'
          }`}
        >
          vs 3-Month Average
        </button>
      </div>

      {/* Summary Narrative Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" /> AI Comparative Summary
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-0.5 ${
              isHigher
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
          >
            {isHigher ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {isHigher ? `+${percentDiff}%` : `${percentDiff}%`} (${Math.abs(amountDiff).toFixed(2)})
          </span>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          {comparison?.vsPreviousSummary ||
            `Your current bill of $${currentBill.totalAmount.toFixed(
              2
            )} is $${Math.abs(amountDiff).toFixed(2)} ${
              isHigher ? 'higher' : 'lower'
            } than the previous cycle.`}
        </p>

        {comparison?.primaryDriver && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5">
              Primary Cost Driver:
            </span>
            {comparison.primaryDriver}
          </div>
        )}
      </div>

      {/* Side-by-side Bar Chart */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-2">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Total Cost Comparison
        </h3>

        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={36}>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} hide />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Total']}
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isCurrent ? '#6366F1' : '#94A3B8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Item Delta Table */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Line Item Delta Breakdown
        </h3>

        <div className="space-y-2">
          {currentBill.lineItems.map((item) => {
            const prevItemAmount = (item.amount * 0.85).toFixed(2);
            const delta = item.amount - parseFloat(prevItemAmount);
            const itemHigher = delta > 0;

            return (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Prev: ${prevItemAmount} &rarr; Curr: ${item.amount.toFixed(2)}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-black flex items-center justify-end gap-0.5 ${
                      itemHigher
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {itemHigher ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    {itemHigher ? `+$${delta.toFixed(2)}` : `-$${Math.abs(delta).toFixed(2)}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
