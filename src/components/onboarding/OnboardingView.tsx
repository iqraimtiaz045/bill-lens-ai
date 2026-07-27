import React, { useState } from 'react';
import { Camera, Sparkles, AlertTriangle, ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Camera,
      color: 'bg-indigo-600 text-white',
      title: 'Snap a photo of any bill',
      description:
        'Upload utility, hospital, internet, or retail receipts. Our OCR engine extracts every line item in seconds.',
    },
    {
      icon: Sparkles,
      color: 'bg-amber-500 text-white',
      title: 'AI explains every charge',
      description:
        'Google Gemini translates dense line items like TDS, Peak Surcharges, and Unbundled Fees into plain English.',
    },
    {
      icon: AlertTriangle,
      color: 'bg-rose-500 text-white',
      title: 'Spot hidden fees & anomalies',
      description:
        'Receive instant alerts when a bill contains unexpected tariff spikes or unbundled administrative charges.',
    },
    {
      icon: ShieldCheck,
      color: 'bg-emerald-600 text-white',
      title: 'Track your Health Score',
      description:
        'Monitor your composite 0–100 Financial Health Score and unlock personalized savings tips every month.',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const current = slides[currentSlide];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col justify-between p-6 max-w-md mx-auto">
      {/* Top Skip Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onComplete}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 my-auto">
        <div
          className={`w-28 h-28 rounded-3xl ${current.color} flex items-center justify-center shadow-xl transform transition-transform duration-500 scale-105`}
        >
          <Icon className="w-14 h-14" />
        </div>

        <div className="space-y-2 max-w-xs">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {current.title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {current.description}
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center gap-1.5 pt-4">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? 'w-6 bg-indigo-600'
                  : 'w-2 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="pb-4">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
        >
          <span>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </span>
          {currentSlide === slides.length - 1 ? (
            <Check className="w-5 h-5 stroke-[3]" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
