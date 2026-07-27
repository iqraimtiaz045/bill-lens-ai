import React from 'react';
import {
  Bell,
  AlertTriangle,
  Sparkles,
  CheckCheck,
  ChevronRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectNotification: (notif: NotificationItem) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllRead,
  onSelectNotification,
}) => {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'anomaly_alert':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'tip':
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
            Notifications & Alerts
          </h2>
          <p className="text-xs text-slate-500">
            {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {notifications.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No notifications yet
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              You will receive alerts here whenever Gemini AI detects fee anomalies or savings tips.
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onSelectNotification(notif)}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                !notif.isRead
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/80 shadow-2xs'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 opacity-90'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {notif.title}
                  </h4>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                  {notif.body}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(notif.createdAt).toLocaleDateString()}
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
