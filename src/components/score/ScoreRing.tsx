import React from 'react';
import { ShieldCheck, AlertCircle, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { HealthScoreSnapshot } from '../../types';

interface ScoreRingProps {
  score: number;
  label?: HealthScoreSnapshot['label'];
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  label = 'Good',
  size = 'md',
  onClick,
}) => {
  const getScoreColor = (s: number) => {
    if (s === 0)
      return {
        stroke: '#94A3B8',
        text: 'text-slate-500 dark:text-slate-400',
        bg: 'bg-slate-50 dark:bg-slate-900',
        badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      };
    if (s >= 80)
      return {
        stroke: '#10B981',
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
      };
    if (s >= 65)
      return {
        stroke: '#F59E0B',
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
      };
    return {
      stroke: '#EF4444',
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
    };
  };

  const colorConfig = getScoreColor(score);
  const strokeWidth = size === 'lg' ? 12 : 10;
  const radius = size === 'lg' ? 58 : size === 'sm' ? 36 : 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-all hover:shadow-md ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      }`}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={svgSize}
          height={svgSize}
          className="transform -rotate-90 transition-all duration-700 ease-out"
        >
          {/* Background Ring */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-700"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Filled Animated Score Ring */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={colorConfig.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-black tracking-tight ${colorConfig.text} ${size === 'lg' ? 'text-3xl' : 'text-2xl'}`}>
            {score}
          </span>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            / 100
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            Financial Health Score <Info className="w-3 h-3 text-slate-400" />
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${colorConfig.badge}`}>
            {score === 0 ? 'Not Set' : label}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-snug">
          {score === 0
            ? 'No bills added yet. Upload or scan your first bill to calculate your score.'
            : score >= 80
            ? 'Great job! Minimal fee anomalies and healthy monthly consistency.'
            : score >= 65
            ? 'Moderate spikes detected in peak electricity & unbundled fees.'
            : 'Multiple high surcharges flagged. Tap to review savings tips.'}
        </p>

        {score === 0 ? (
          <div className="mt-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Scan a bill to get started
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+4 pts from last month</span>
          </div>
        )}
      </div>
    </div>
  );
};
