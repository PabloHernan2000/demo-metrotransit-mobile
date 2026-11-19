/* eslint-disable no-undef */
if (typeof global.window !== 'undefined' && !global.window.dispatchEvent) {
  global.window.dispatchEvent = () => true;
}
if (typeof window !== 'undefined' && !window.dispatchEvent) {
  window.dispatchEvent = () => true;
}

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => ({ status: 'success', data: {} }),
  text: async () => 'OK',
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn((comp) => comp),
    Directions: {},
    GestureHandlerRootView: ({ children, ...props }) => React.createElement(View, props, children),
    Gesture: {
      Pan: () => ({ onChange: jest.fn().mockReturnThis(), onEnd: jest.fn().mockReturnThis() }),
      Tap: () => ({ onEnd: jest.fn().mockReturnThis() }),
    },
    GestureDetector: ({ children }) => children,
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest')
);

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn().mockResolvedValue(true),
  getGenericPassword: jest.fn().mockResolvedValue({ password: 'test-token', username: 'test-user' }),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
  ACCESSIBLE: {
    WHEN_UNLOCKED: 'AccessibleWhenUnlocked',
  },
}));

jest.mock('@react-native-community/geolocation', () => ({
  setRNConfiguration: jest.fn(),
  getCurrentPosition: jest.fn((success) =>
    success({
      coords: {
        latitude: 20.1011,
        longitude: -98.7591,
        altitude: 0,
        accuracy: 1,
        heading: 0,
        speed: 0,
      },
    })
  ),
  watchPosition: jest.fn().mockReturnValue(1),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
}));

jest.mock('@react-native-firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('@react-native-firebase/messaging', () => {
  const messaging = () => ({
    hasPermission: jest.fn().mockResolvedValue(true),
    requestPermission: jest.fn().mockResolvedValue(true),
    getToken: jest.fn().mockResolvedValue('mock-fcm-token'),
    onMessage: jest.fn().mockReturnValue(() => {}),
    onNotificationOpenedApp: jest.fn().mockReturnValue(() => {}),
    getInitialNotification: jest.fn().mockResolvedValue(null),
    setBackgroundMessageHandler: jest.fn(),
  });
  messaging.AuthorizationStatus = { AUTHORIZED: 1 };
  return messaging;
});

jest.mock('@notifee/react-native', () => ({
  displayNotification: jest.fn(),
  createChannel: jest.fn(),
  onForegroundEvent: jest.fn().mockReturnValue(() => {}),
  onBackgroundEvent: jest.fn(),
  AndroidImportance: { HIGH: 4 },
}));

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = (props) => React.createElement(View, props, props.children);
  const MockMarker = (props) => React.createElement(View, props, props.children);
  const MockPolyline = (props) => React.createElement(View, props, props.children);
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Polyline: MockPolyline,
    PROVIDER_GOOGLE: 'google',
  };
});

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock').default;
  return mock;
});

jest.mock('react-native-screens', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    enableScreens: jest.fn(),
    screensEnabled: jest.fn().mockReturnValue(true),
    ScreenContainer: View,
    Screen: View,
    NativeScreen: View,
    NativeScreenContainer: View,
  };
});
