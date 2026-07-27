import React from 'react';
import { Bell, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';
import { useLanguage } from '../../lib/i18n';

interface HeaderProps {
  user: UserProfile;
  unreadCount: number;
  isFirebaseConnected?: boolean;
  selectedCurrency?: string;
  onCurrencyChange?: (currencyCode: string) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const { t } = useLanguage();

  const getInitials = (name: string) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/80 shadow-xs">
      <div className="flex items-center gap-3">
        {/* User Profile Avatar */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="relative group cursor-pointer focus:outline-none"
          title="Open Profile Settings"
        >
          <div className="w-10 h-10 rounded-2xl ring-2 ring-teal-500/30 overflow-hidden bg-gradient-to-tr from-teal-500 via-sky-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md transition-transform group-hover:scale-105 active:scale-95">
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
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
        </button>

        {/* Brand & Greeting */}
        <div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-teal-500 to-sky-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-[10px] font-black tracking-widest text-teal-600 dark:text-teal-400 uppercase">
              BILL LENS AI
            </span>
          </div>
          <h1 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
            Hi, {user?.name ? user.name.split(' ')[0] : 'User'} 👋
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-all focus:outline-none cursor-pointer"
          title="Notifications & Alerts"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping" />
          )}
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>
      </div>
    </header>
  );
};
