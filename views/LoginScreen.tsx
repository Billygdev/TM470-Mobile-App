import { useLoginViewModel } from '@/viewModels/useLoginViewModel';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';

export default function LoginScreen() {
  const { colors } = useTheme();
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
    navigateToSignUp,
  } = useLoginViewModel();

  return (
    <View
      testID="login-screen-root"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
        Login
      </Text>

      <TextInput
        label="Email"
        accessibilityLabel="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        label="Password"
        accessibilityLabel="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {error && <HelperText type="error" visible>{error}</HelperText>}

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
        accessibilityLabel="Log In"
      >
        Log In
      </Button>

      <Button
        mode="text"
        onPress={navigateToSignUp}
        style={styles.button}
        accessibilityLabel="Sign Up"
      >
        Sign Up
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});