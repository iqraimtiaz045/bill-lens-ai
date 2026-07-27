import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Moon,
  Sun,
  Monitor,
  Bell,
  ShieldCheck,
  Info,
  Smartphone,
  Lock,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdatePreferences: (preferences: UserProfile['preferences']) => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdatePreferences,
  onBack,
}) => {
  const [darkMode, setDarkMode] = useState<'system' | 'light' | 'dark'>(
    user.preferences?.darkMode || 'light'
  );
  const [notifications, setNotifications] = useState(
    user.preferences?.notifications || {
      anomalyAlerts: true,
      reminders: true,
      tips: true,
      weeklySummary: true,
    }
  );

  useEffect(() => {
    if (user.preferences?.darkMode) {
      setDarkMode(user.preferences.darkMode);
    }
    if (user.preferences?.notifications) {
      setNotifications(user.preferences.notifications);
    }
  }, [user.preferences]);

  const handleToggleNotif = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    onUpdatePreferences({
      darkMode,
      notifications: updated,
    });
  };

  const handleThemeChange = (mode: 'system' | 'light' | 'dark') => {
    setDarkMode(mode);
    onUpdatePreferences({
      darkMode: mode,
      notifications,
    });
  };

  return (
    <div className="space-y-4 pb-24 pt-1 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </button>
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Preferences & Settings
        </h2>
      </div>

      {/* Appearance Section */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Moon className="w-4 h-4 text-indigo-500" /> Appearance Theme
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Monitor },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleThemeChange(id as 'light' | 'dark' | 'system')}
              className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                darkMode === id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-indigo-500" /> Notification Controls
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Charge Anomaly Alerts
              </span>
              <span className="text-[11px] text-slate-500">
                Notify when peak demand or fee spikes are detected
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.anomalyAlerts}
              onChange={() => handleToggleNotif('anomalyAlerts')}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Bill Due Date Reminders
              </span>
              <span className="text-[11px] text-slate-500">
                Reminders before bill due dates arrive
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.reminders}
              onChange={() => handleToggleNotif('reminders')}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Personalized Savings Tips
              </span>
              <span className="text-[11px] text-slate-500">
                New actionable suggestions derived from Gemini AI
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.tips}
              onChange={() => handleToggleNotif('tips')}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
          </div>
        </div>
      </div>

      {/* App Information & Compliance */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-2 text-xs">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Info className="w-4 h-4 text-indigo-500" /> About BILL LENS
        </h3>

        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
          <span className="text-slate-500">Application Version</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">v1.0.0 (Production Build)</span>
        </div>

        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
          <span className="text-slate-500">AI Model Engine</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">Google Gemini 3.6 Flash</span>
        </div>

        <div className="flex justify-between py-1">
          <span className="text-slate-500">Read-Only Financial Data</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">Zero Payment Integrations</span>
        </div>
      </div>
    </div>
  );
};
