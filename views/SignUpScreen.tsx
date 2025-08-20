import { useSignUpViewModel } from '@/viewModels/useSignUpViewModel';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';

export default function SignUpScreen() {
  const { colors } = useTheme();
    const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    handleSignUp,
    navigateToLogin,
  } = useSignUpViewModel();

  return (
    <View
      testID="signup-screen-root"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
        Sign Up
      </Text>

      <TextInput
        label="Username"
        accessibilityLabel="Username"
        mode="outlined"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />

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

      <TextInput
        label="Confirm Password"
        accessibilityLabel="Confirm Password"
        mode="outlined"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      {!!error && (
        <HelperText type="error" visible>
          {String(error)}
        </HelperText>
      )}

      <Button
        mode="contained"
        onPress={handleSignUp}
        loading={loading}
        disabled={loading}
        style={styles.button}
        accessibilityLabel="Create Account"
      >
        Create Account
      </Button>

      <Button
        mode="text"
        onPress={navigateToLogin}
        style={styles.button}
        accessibilityLabel="Cancel"
      >
        Cancel
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
