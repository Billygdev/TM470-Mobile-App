import { useSnackbar } from '@/contexts/SnackbarContext';
import React, { createContext, ReactNode, useContext, useState } from 'react';

type Notification = {
  id: string;
  title: string;
  body: string;
  timestamp: number;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notif: Omit<Notification, 'id'>) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { showSnackbar } = useSnackbar();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
    };
    
    setNotifications((prev) => [newNotification, ...prev]);

    showSnackbar({ message: notification.body, type: 'success' });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
