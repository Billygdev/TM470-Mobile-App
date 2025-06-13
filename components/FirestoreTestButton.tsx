import { useFirestoreTestButtonViewModel } from '@/viewModels/useFirestoreTestButtonViewModel';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function TestButton() {
  const { handlePress, loading, value } = useFirestoreTestButtonViewModel();

  return (
    <View style={styles.wrapper}>
      <Button mode="outlined" onPress={handlePress} loading={loading} style={styles.button}>
        Test Firestore Counter
      </Button>
      {value !== null && (
        <Text style={styles.text}>Current value: {value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  button: {
    margin: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});
