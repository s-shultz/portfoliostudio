import React, { useState, useEffect } from 'react';
import { CheckCircle, Monitor, Sparkles } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  duration?: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemoveNotification: (id: string) => void;
}

export default function NotificationSystem({ notifications, onRemoveNotification }: NotificationSystemProps) {
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          onRemoveNotification(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onRemoveNotification]);

  return (
    <div className="fixed top-4 right-4 z-[200] space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl border-2 border-yellow-400 animate-in slide-in-from-right-4 zoom-in-95 duration-500"
        >
          <div className="flex items-center gap-3">
            <div className="animate-spin">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <div className="font-bold text-lg">🎉 Portfolio Interaction!</div>
              <div className="text-sm opacity-90">{notification.message}</div>
            </div>
            <CheckCircle className="w-6 h-6 text-green-300 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Hook to manage notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success', duration = 4000) => {
    const id = Date.now().toString();
    const notification: Notification = {
      id,
      message,
      type,
      duration
    };

    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification
  };
}