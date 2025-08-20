const rnPreset = require('react-native/jest-preset');

const moduleNameMapper = {
  '^@/(.*)$': '<rootDir>/$1',
  '^expo/src/winter/.*$': '<rootDir>/__mocks__/expo-winter.js',
  ...rnPreset.moduleNameMapper,
};

module.exports = {
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      transform: {
        '^.+\\.[jt]sx?$': [
          'ts-jest',
          { babelConfig: true },
        ],
      },
      moduleNameMapper,
      transformIgnorePatterns: [
        'node_modules/(?!(firebase|@firebase|react-native|react-native-.*|@react-native/.*|expo-.*)/)',
      ],
      testMatch: ['**/__tests__/units/**/*.test.ts?(x)'],
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.[jt]sx?$': [
          'ts-jest',
          { babelConfig: true },
        ],
      },
      moduleNameMapper,
      setupFiles: ['<rootDir>/jest.setup.ts'],
      setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
      transformIgnorePatterns: [
        'node_modules/(?!(firebase|@firebase|react-native|react-native-.*|@react-native/.*|expo-.*)/)',
      ],
      testMatch: ['**/__tests__/integrations/**/*.test.ts?(x)'],
    },
  ],
};
