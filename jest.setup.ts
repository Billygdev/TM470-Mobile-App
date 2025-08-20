// Provide React Native globals BEFORE any requires
(global as any).__DEV__ = true;

// Mock core react-native
jest.mock('react-native', () => {
  const React = require('react');
  return {
    __esModule: true,
    ...jest.requireActual('react-native-web'),
    Text: (props: any) =>
      React.createElement('span', { ...props, 'data-testid': props.testID }, props.children),
    View: (props: any) =>
      React.createElement('div', { ...props, 'data-testid': props.testID }, props.children),
    ScrollView: (props: any) =>
      React.createElement(
        'div',
        { ...props, 'data-testid': props.testID, style: { overflowY: 'auto', ...props.style } },
        props.children
      ),
  };
});

// Mock expo-router
jest.mock('expo-router', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const mockPush = jest.fn();

  return {
    Link: ({ href, children }: { href: string; children: React.ReactNode }) =>
      React.createElement(
        Text,
        {
          accessibilityRole: 'link',
          accessibilityLabel: `Link to ${href}`,
          onPress: () => mockPush(href),
        },
        children
      ),

    useRouter: () => ({
      push: mockPush,
    }),
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  return {
    __esModule: true,
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: ({ children }: any) => children,
    SafeAreaInsetsContext: {
      Consumer: ({ children }: any) =>
        children({ top: 0, bottom: 0, left: 0, right: 0 }),
      Provider: ({ children }: any) => children,
    },
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// Mock Expo “winter” runtime to prevent it from executing in Jest
jest.mock('expo/src/winter/runtime.native.ts', () => ({}));
jest.mock('expo/src/winter/runtime.ts', () => ({}));
jest.mock('expo/src/winter/index.ts', () => ({}));

// Silence common RN warnings in test output
jest.spyOn(global.console, 'warn').mockImplementation((msg, ...args) => {
  if (typeof msg === 'string' && msg.includes('ReactNativePublicAPI')) return;
  (console.warn as any).mock.calls.push([msg, ...args]);
});

jest.spyOn(global.console, 'error').mockImplementation((msg, ...args) => {
  if (typeof msg === 'string' && msg.includes('ReactNativePublicAPI')) return;
  (console.error as any).mock.calls.push([msg, ...args]);
});
