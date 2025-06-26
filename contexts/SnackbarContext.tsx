import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Snackbar } from 'react-native-paper';

type SnackbarType = 'success' | 'error' | 'warn';

interface SnackbarOptions {
  message: string;
  type?: SnackbarType;
  duration?: number;
}

interface SnackbarContextProps {
  showSnackbar: (options: SnackbarOptions) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within a SnackbarProvider');
  return ctx;
}

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<SnackbarType>('success');
  const [duration, setDuration] = useState(2000);

  const showSnackbar = ({ message, type = 'success', duration = 2000 }: SnackbarOptions) => {
    setMessage(message);
    setType(type);
    setDuration(duration);
    setVisible(true);
  };

  const backgroundColor = {
    success: '#4CAF50', // green
    warn: '#FFC107',    // amber
    error: '#F44336',   // red
  }[type];

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={duration}
        style={{ backgroundColor }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
