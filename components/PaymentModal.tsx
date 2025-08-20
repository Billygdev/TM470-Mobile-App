import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

type PaymentModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (cardDetails: {
    nameOnCard: string;
    cardNumber: string;
    expiry: string;
    securityCode: string;
  }) => void;
  amount: number;
};

export function PaymentModal({ visible, onClose, onSubmit, amount }: PaymentModalProps) {
  const { colors } = useTheme();

  const [nameOnCard, setNameOnCard] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [securityCode, setSecurityCode] = React.useState('');
  const [error, setError] = React.useState('');

  const validateFields = () => {
    if (!nameOnCard || !cardNumber || !expiry || !securityCode) {
      return 'All fields are required.';
    }

    // Basic card number and security validation
    if (!/^\d{16}$/.test(cardNumber)) return 'Card number must be 16 digits.';
    if (!/^\d{3,4}$/.test(securityCode)) return 'Security code must be 3 or 4 digits.';
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Expiry must be in MM/YY format.';

    return '';
  };

  const handleSubmit = () => {
    const validationError = validateFields();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    onSubmit({ nameOnCard, cardNumber, expiry, securityCode });
    onClose();
  };

  return (
    <Modal
      testID="payment-modal-root"
      visible={visible} animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <Text variant="titleLarge" style={styles.title}>Payment - £{amount}</Text>

          <TextInput
            label="Name on Card"
            accessibilityLabel="Name on Card"
            value={nameOnCard}
            onChangeText={setNameOnCard}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Card Number"
            accessibilityLabel="Card Number"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            maxLength={16}
          />

          <TextInput
            label="Expiry (MM/YY)"
            accessibilityLabel="Expiry (MM/YY)"
            value={expiry}
            onChangeText={setExpiry}
            mode="outlined"
            style={styles.input}
            placeholder="MM/YY"
            maxLength={5}
          />

          <TextInput
            label="Security Code"
            accessibilityLabel="Security Code"
            value={securityCode}
            onChangeText={setSecurityCode}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            maxLength={4}
          />

          {!!error && (
            <HelperText type="error" visible>
              {error}
            </HelperText>
          )}

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Pay
          </Button>
          
          <Button mode="text" onPress={onClose}>Cancel</Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 8,
    padding: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginVertical: 8,
  },
});