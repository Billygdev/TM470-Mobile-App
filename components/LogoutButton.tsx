import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Button } from 'react-native-paper';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button mode="outlined" onPress={logout} style={{ margin: 16 }}>
      Logout
    </Button>
  );
}
