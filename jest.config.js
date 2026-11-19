module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@notifee/.*|react-native-gesture-handler|react-native-keychain|react-native-maps|react-native-safe-area-context|react-native-screens|react-native-svg|@react-native-async-storage)/',
  ],
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
  },
};
