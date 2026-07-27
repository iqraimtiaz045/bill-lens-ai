import React from 'react';
import { Home, History, BarChart3, User, Scan } from 'lucide-react';
import { useLanguage } from '../../lib/i18n';

export type NavTab = 'home' | 'history' | 'insights' | 'notifications' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenUpload: () => void;
  unreadNotificationsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenUpload,
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-4 pt-2 pointer-events-none">
      <div className="pointer-events-auto relative flex items-center justify-between bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/60 dark:border-slate-800/80 rounded-3xl shadow-2xl shadow-sky-950/10 dark:shadow-black/50 px-3 py-2">
        {/* Home Tab */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'home'
              ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'home' ? 'bg-teal-50 dark:bg-teal-950/50' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight font-medium mt-0.5">{t('home')}</span>
        </button>

        {/* History Tab */}
        <button
          type="button"
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'history'
              ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'history' ? 'bg-teal-50 dark:bg-teal-950/50' : ''}`}>
            <History className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight font-medium mt-0.5">{t('history')}</span>
        </button>

        {/* Floating Center Scan CTA */}
        <div className="flex flex-col items-center justify-center flex-1 -mt-7 relative group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-400 to-sky-500 blur-sm opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse" />
          <button
            type="button"
            onClick={onOpenUpload}
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-teal-600 via-sky-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white flex flex-col items-center justify-center shadow-lg shadow-sky-600/30 ring-4 ring-white dark:ring-slate-900 transition-all duration-200 active:scale-95 cursor-pointer"
            title="Scan Bill with AI"
          >
            <Scan className="w-6 h-6 stroke-[2.2] animate-bounce-slow" />
          </button>
          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 tracking-tight mt-1">{t('scanBill')}</span>
        </div>

        {/* Analytics Tab */}
        <button
          type="button"
          onClick={() => onTabChange('insights')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'insights'
              ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'insights' ? 'bg-teal-50 dark:bg-teal-950/50' : ''}`}>
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight font-medium mt-0.5">{t('analytics')}</span>
        </button>

        {/* Profile Tab */}
        <button
          type="button"
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'profile'
              ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-teal-50 dark:bg-teal-950/50' : ''}`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight font-medium mt-0.5">{t('profile')}</span>
        </button>
      </div>
    </div>
  );
};
