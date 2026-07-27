import React, { useState } from 'react';
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  X,
  HelpCircle,
  ShieldCheck,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';
import { HealthScoreSnapshot } from '../../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface HealthScoreViewProps {
  scoreSnapshot: HealthScoreSnapshot;
}

export const HealthScoreView: React.FC<HealthScoreViewProps> = ({ scoreSnapshot }) => {
  const [showModal, setShowModal] = useState(false);

  // Mock historical score trend over past 6 months
  const trendData = [
    { month: 'Feb', score: 68 },
    { month: 'Mar', score: 72 },
    { month: 'Apr', score: 70 },
    { month: 'May', score: 75 },
    { month: 'Jun', score: 74 },
    { month: 'Jul', score: scoreSnapshot.score },
  ];

  return (
    <div className="space-y-5">
      {/* Top Gauge Ring & Label Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm text-center relative overflow-hidden">
        <button
          onClick={() => setShowModal(true)}
          className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          title="Calculation methodology"
        >
          <Info className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
          Your Financial Health Score
        </span>

        {/* Circular gauge styling */}
        <div className="relative w-36 h-36 mx-auto my-2 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="60"
              className="stroke-slate-100 dark:stroke-slate-700"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke={
                scoreSnapshot.score >= 80
                  ? '#10B981'
                  : scoreSnapshot.score >= 65
                  ? '#F59E0B'
                  : '#EF4444'
              }
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 60}
              strokeDashoffset={
                2 * Math.PI * 60 - (scoreSnapshot.score / 100) * (2 * Math.PI * 60)
              }
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-black text-slate-900 dark:text-slate-100">
              {scoreSnapshot.score}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              / 100
            </span>
          </div>
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 mt-1">
          Status: {scoreSnapshot.label}
        </span>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
          Calculated automatically from charge stability, anomaly frequency, & unbundled fee ratio.
        </p>
      </div>

      {/* 6-Month Trend Chart */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-500" /> Score History (6 Months)
          </h3>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            +6 pts overall
          </span>
        </div>

        <div className="h-36 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis domain={[50, 100]} stroke="#94A3B8" fontSize={11} hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ fill: '#6366F1', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contributing Factors List */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Contributing Score Factors
        </h3>

        <div className="space-y-2.5">
          {scoreSnapshot.factors.map((factor, idx) => {
            const isPositive = factor.impact >= 0;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  {isPositive ? (
                    <PlusCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <MinusCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                      {factor.label}
                    </span>
                    {factor.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {factor.description}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`text-xs font-black shrink-0 px-2 py-0.5 rounded ${
                    isPositive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  {isPositive ? `+${factor.impact}` : factor.impact}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calculation Methodology Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-500" /> Score Methodology
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <p>
                The <strong>Financial Health Score (0–100)</strong> evaluates your household bill management across four key dimensions:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
                <li><strong>Charge Stability (35%):</strong> Month-over-month predictability of base rates.</li>
                <li><strong>Fee Ratio (25%):</strong> Proportion of taxes and unbundled administrative surcharges vs base services.</li>
                <li><strong>Anomaly Frequency (25%):</strong> Presence of unexpected spikes or new charges.</li>
                <li><strong>Payment Cadence (15%):</strong> Timeliness of billing cycles and avoidance of late fee penalties.</li>
              </ul>
              <p className="text-[11px] text-slate-400 italic pt-1">
                Note: Scores are informational guidance generated by AI heuristics to highlight financial leakage points.
              </p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
