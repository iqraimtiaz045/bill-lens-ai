import React, { useState, useRef } from 'react';
import {
  User,
  Settings,
  Users,
  MapPin,
  Home,
  ShieldCheck,
  Moon,
  Sun,
  Bell,
  Download,
  Trash2,
  LogOut,
  ChevronRight,
  Sparkles,
  Camera,
  Globe,
  Sliders,
  CheckCircle2,
  Lock,
  X
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useLanguage, Language } from '../../lib/i18n';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenSettings: () => void;
  onDownloadData: () => void;
  onDeleteAccount: () => void;
  onSignOut: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onOpenSettings,
  onDownloadData,
  onDeleteAccount,
  onSignOut,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || '');
  const [householdSize, setHouseholdSize] = useState<number | undefined>(user.householdSize);
  const [region, setRegion] = useState(user.region || '');
  const [homeType, setHomeType] = useState(user.homeType || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      householdSize: householdSize ? Number(householdSize) : undefined,
      region: region.trim() || undefined,
      homeType: homeType.trim() || undefined,
    });
    setIsEditing(false);
  };

  const toggleDarkMode = () => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('billwise_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('billwise_theme', 'light');
    }
    onUpdateUser({
      preferences: {
        ...(user.preferences || {
          darkMode: 'light',
          notifications: { anomalyAlerts: true, reminders: true, tips: true, weeklySummary: true },
        }),
        darkMode: newTheme,
      },
    });
  };

  return (
    <div className="space-y-5 pb-24 pt-2 animate-fade-in">
      {/* Profile Header & Custom Avatar Upload */}
      <div className="p-6 rounded-3xl bg-gradient-to-tr from-slate-900 via-sky-950 to-teal-900 text-white shadow-xl text-center relative overflow-hidden border border-sky-800/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-teal-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative inline-block mx-auto mb-3">
          <div className="w-20 h-20 rounded-3xl ring-4 ring-teal-400/50 overflow-hidden bg-gradient-to-tr from-teal-500 via-sky-500 to-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span>{user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-md transition-transform active:scale-90 cursor-pointer"
            title="Upload custom profile picture"
          >
            <Camera className="w-4 h-4 stroke-[2.5]" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        <h2 className="text-xl font-black tracking-tight">{user.name || 'User'}</h2>
        <p className="text-xs text-sky-200/80 font-medium">{user.email || 'No email associated'}</p>

        {user.region && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-teal-300 border border-white/20">
            <MapPin className="w-3.5 h-3.5" />
            <span>{user.region}</span>
          </div>
        )}
      </div>

      {/* Household & Personal Details Card */}
      <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Users className="w-4 h-4 text-teal-500" /> User Information
          </h3>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            {isEditing ? 'Cancel' : 'Edit Information'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Household Members
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={householdSize ?? ''}
                  onChange={(e) =>
                    setHouseholdSize(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Property Type
                </label>
                <input
                  type="text"
                  value={homeType}
                  onChange={(e) => setHomeType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-600 text-white font-extrabold text-xs shadow-md hover:from-teal-600 hover:to-sky-700 transition-all cursor-pointer"
            >
              Save Profile Details
            </button>
          </form>
        ) : (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <Home className="w-4 h-4 text-teal-500" /> Home Category
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {user.homeType || '10 Marla House'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-500" /> Household Members
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {user.householdSize || 4} Persons
              </span>
            </div>
          </div>
        )}
      </div>

      {/* App Preferences (Currency PKR, Dark Mode, Language) */}
      <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          {t('appPreferences')}
        </h3>

        {/* Currency PKR Fixed Display */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-500" /> {t('currencyLabel')}
          </span>
          <span className="px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-black text-xs">
            {t('currencyValue')}
          </span>
        </div>

        {/* Language Selector */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-500" /> {t('preferredLanguage')}
          </span>
          <select
            value={language}
            onChange={(e) => {
              const selected = e.target.value as Language;
              setLanguage(selected);
              onUpdateUser({
                preferences: {
                  ...user.preferences,
                  darkMode: user.preferences?.darkMode || 'light',
                  language: selected,
                  notifications: user.preferences?.notifications || {
                    anomalyAlerts: true,
                    reminders: true,
                    tips: true,
                    weeklySummary: true,
                  },
                },
              });
            }}
            className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Urdu">Urdu (اردو)</option>
          </select>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-500" /> {t('darkMode')}
          </span>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-amber-300 font-bold transition-all cursor-pointer"
          >
            {document.documentElement.classList.contains('dark') ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* AI Settings */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-500" /> {t('aiSettingsAlerts')}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Account Actions & Data Privacy */}
      <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
          {t('dataAndAccount')}
        </h3>

        <button
          type="button"
          onClick={onDownloadData}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Download className="w-4 h-4 text-slate-400" /> {t('exportAllData')}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={onSignOut}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-slate-400" /> {t('signOut')}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-xs font-bold text-rose-600 dark:text-rose-400 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> {t('deleteAccount')}
          </span>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>

      {/* Delete Account Confirm Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> {t('confirmDeleteAccount')}
              </h3>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {t('deleteWarning')}
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  onDeleteAccount();
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-600 text-white font-extrabold text-xs hover:bg-rose-700 shadow-md cursor-pointer"
              >
                {t('permanentlyDelete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
